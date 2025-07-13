import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
  ) {}

  async getConversations(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Conversation>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.conversationModel
        .find({ participants: userId })
        .populate('participants', 'name email avatar status')
        .populate('lastMessage')
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .exec(),
      this.conversationModel.countDocuments({ participants: userId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createConversation(userId: string, participantId: string): Promise<Conversation> {
    // Check if conversation already exists
    const existingConversation = await this.conversationModel
      .findOne({
        participants: { $all: [userId, participantId] },
      })
      .populate('participants', 'name email avatar status')
      .exec();

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = new this.conversationModel({
      participants: [userId, participantId],
    });

    await conversation.save();
    return conversation.populate('participants', 'name email avatar status');
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    return this.conversationModel
      .findById(id)
      .populate('participants', 'name email avatar status')
      .exec();
  }

  async getMessages(conversationId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Message>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.messageModel
        .find({ conversationId })
        .populate('senderId', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.messageModel.countDocuments({ conversationId }).exec(),
    ]);

    return {
      data: data.reverse(), // Reverse to show oldest first
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async sendMessage(userId: string, conversationId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel({
      ...createMessageDto,
      senderId: userId,
      conversationId,
    });

    await message.save();

    // Update conversation's last message
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    return message.populate('senderId', 'name email avatar');
  }
}