import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Message } from './schemas/message.schema';
import { Conversation } from './schemas/conversation.schema';
import { StreamChatService } from '../../Infastructure/StreamChat/stream-chat.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly streamChatService: StreamChatService,
  ) {}

  async getConversations(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Conversation>> {
    return this.messagesRepository.getConversations(userId, paginationDto);
  }

  async getMessages(conversationId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Message>> {
    return this.messagesRepository.getMessages(conversationId, paginationDto);
  }

  async sendMessage(userId: string, conversationId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesRepository.sendMessage(userId, conversationId, createMessageDto);
  }

  // Stream Chat integration methods
  async generateUserToken(userId: string): Promise<string> {
    return this.streamChatService.generateUserToken(userId);
  }

  async getOrCreateStreamChannel(userId1: string, userId2: string) {
    return this.streamChatService.getOrCreateChannel(userId1, userId2);
  }

  async getUserStreamChannels(userId: string) {
    return this.streamChatService.getUserChannels(userId);
  }

  async sendStreamMessage(channelId: string, userId: string, messageText: string, messageData?: any) {
    return this.streamChatService.sendMessage(channelId, userId, messageText, messageData);
  }

  async updateStreamUser(userId: string, userData: any) {
    return this.streamChatService.updateUser(userId, userData);
  }
}