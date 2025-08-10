import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExchangeSession, ExchangeSessionDocument } from './schemas/exchange-session.schema';
import { CreateExchangeSessionDto } from './dto/create-exchange-session.dto';
import { UpdateExchangeSessionDto } from './dto/update-exchange-session.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class ExchangeSessionsRepository {
  constructor(@InjectModel(ExchangeSession.name) private exchangeSessionModel: Model<ExchangeSessionDocument>) {}

  async create(createExchangeSessionDto: CreateExchangeSessionDto & { hostId: string }): Promise<ExchangeSession> {
    const exchangeSession = new this.exchangeSessionModel(createExchangeSessionDto);
    return exchangeSession.save();
  }

  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { hostId: userId },
        { requestedBy: userId }
      ]
    };

    const [data, total] = await Promise.all([
      this.exchangeSessionModel
        .find(query)
        .populate('hostId', 'name email avatar')
        .populate('requestedBy', 'name email avatar')
        .populate('skillId', 'name category')
        .populate('requestedSkillId', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.exchangeSessionModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUpcomingExchangeSessions(userId: string, startDate: string, endDate: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const query = {
      $and: [
        {
          $or: [
            { hostId: userId },
            { requestedBy: userId }
          ]
        },
        {
          date: {
            $gte: startDate,
            $lte: endDate
          }
        },
        {
          status: 'upcoming'
        }
      ]
    };

    const [data, total] = await Promise.all([
      this.exchangeSessionModel
        .find(query)
        .populate('hostId', 'name email avatar')
        .populate('requestedBy', 'name email avatar')
        .populate('skillId', 'name category')
        .populate('requestedSkillId', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ date: 1, startTime: 1 })
        .exec(),
      this.exchangeSessionModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPublic(paginationDto: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.exchangeSessionModel
        .find({ isPublic: true, status: 'upcoming' })
        .populate('hostId', 'name email avatar')
        .populate('requestedBy', 'name email avatar')
        .populate('skillId', 'name category')
        .populate('requestedSkillId', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ date: 1 })
        .exec(),
      this.exchangeSessionModel.countDocuments({ isPublic: true, status: 'upcoming' }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ExchangeSession | null> {
    return this.exchangeSessionModel
      .findById(id)
      .populate('hostId', 'name email avatar')
      .populate('requestedBy', 'name email avatar')
      .populate('skillId', 'name category')
      .populate('requestedSkillId', 'name category')
      .exec();
  }

  async update(id: string, updateExchangeSessionDto: UpdateExchangeSessionDto): Promise<ExchangeSession | null> {
    return this.exchangeSessionModel
      .findByIdAndUpdate(id, updateExchangeSessionDto, { new: true })
      .populate('hostId', 'name email avatar')
      .populate('requestedBy', 'name email avatar')
      .populate('skillId', 'name category')
      .populate('requestedSkillId', 'name category')
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.exchangeSessionModel.findByIdAndDelete(id).exec();
  }

  async search(query: string, status?: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');
    const searchQuery: any = {
      $or: [
        { title: searchRegex },
        { skillCategory: searchRegex },
        { description: searchRegex },
      ],
    };

    if (status && ['upcoming', 'ongoing', 'completed', 'cancelled', 'expired'].includes(status)) {
      searchQuery.status = status;
    }

    const [data, total] = await Promise.all([
      this.exchangeSessionModel
        .find(searchQuery)
        .populate('hostId', 'name email avatar')
        .populate('requestedBy', 'name email avatar')
        .populate('skillId', 'name category')
        .populate('requestedSkillId', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.exchangeSessionModel.countDocuments(searchQuery).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySkillExchange(skillId: string, requestedSkillId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { skillId, requestedSkillId },
        { skillId: requestedSkillId, requestedSkillId: skillId }
      ]
    };

    const [data, total] = await Promise.all([
      this.exchangeSessionModel
        .find(query)
        .populate('hostId', 'name email avatar')
        .populate('requestedBy', 'name email avatar')
        .populate('skillId', 'name category')
        .populate('requestedSkillId', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.exchangeSessionModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async expirePendingSessions(todayStr: string, currentTime: string): Promise<number> {
    // Expire sessions that are still upcoming but their start has passed
    const res = await this.exchangeSessionModel.updateMany(
      {
        status: 'upcoming',
        $or: [
          { date: { $lt: todayStr } },
          { date: todayStr, startTime: { $lt: currentTime } },
        ],
      },
      { $set: { status: 'expired' } }
    ).exec();
    return res.modifiedCount || 0;
  }
} 