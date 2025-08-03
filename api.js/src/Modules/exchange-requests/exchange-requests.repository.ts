import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExchangeRequest, ExchangeRequestDocument } from './exchange-request.schema';

@Injectable()
export class ExchangeRequestsRepository {
  constructor(
    @InjectModel(ExchangeRequest.name)
    private exchangeRequestModel: Model<ExchangeRequestDocument>
  ) {}

  async create(data: Partial<ExchangeRequest>): Promise<ExchangeRequest> {
    const req = new this.exchangeRequestModel(data);
    return req.save();
  }

  async findByUserId(userId: string): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).populate('sessionId').populate('requester').populate('recipient').populate('offeredSkillId').populate('requestedSkillId').exec();
  }

  async findBySessionHostId(hostId: string): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.find({
      'sessionId.hostId': hostId
    }).populate({
      path: 'sessionId',
      populate: {
        path: 'hostId',
        select: 'name email avatar'
      }
    }).populate('requester', 'name email avatar').populate('recipient', 'name email avatar').populate('offeredSkillId').populate('requestedSkillId').exec();
  }

  async findBySessionId(sessionId: string): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.find({ sessionId }).populate('requester').populate('recipient').populate('offeredSkillId').populate('requestedSkillId').exec();
  }

  async updateStatus(id: string, status: string): Promise<ExchangeRequest | null> {
    return this.exchangeRequestModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async findAll(): Promise<ExchangeRequest[]> {
    return this.exchangeRequestModel.find().populate('sessionId').populate('requester').populate('recipient').populate('offeredSkillId').populate('requestedSkillId').exec();
  }

  async findById(id: string): Promise<ExchangeRequest | null> {
    return this.exchangeRequestModel.findById(id).exec();
  }
} 