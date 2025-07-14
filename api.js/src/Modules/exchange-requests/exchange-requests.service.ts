import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange-request.dto';
import { Types } from 'mongoose';

@Injectable()
export class ExchangeRequestsService {
  constructor(private readonly repo: ExchangeRequestsRepository) {}

  async create(userId: string, dto: CreateExchangeRequestDto) {
    return this.repo.create({
      ...dto,
      sessionId: new Types.ObjectId(dto.sessionId),
      requester: new Types.ObjectId(userId),
      recipient: new Types.ObjectId(dto.recipient),
      status: 'pending',
    });
  }

  async findByUserId(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async findBySessionId(sessionId: string) {
    return this.repo.findBySessionId(sessionId);
  }

  async update(userId: string, id: string, dto: UpdateExchangeRequestDto) {
    const req = await this.repo.findById(id);
    if (!req) throw new NotFoundException('Exchange request not found');
    if (req.requester.toString() !== userId && req.recipient.toString() !== userId) {
      throw new ForbiddenException('You can only update your own exchange requests');
    }
    if (dto.status) {
      return this.repo.updateStatus(id, dto.status);
    }
    return req;
  }

  async findAll() {
    return this.repo.findAll();
  }
} 