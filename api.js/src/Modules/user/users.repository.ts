import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Session, SessionDocument } from '../sessions/schemas/session.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find()
        .select('-password')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').lean().exec();
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    // Used internally where password verification is required
    return this.userModel.findById(id).lean().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
  }

  async search(query: string, paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');
    const searchQuery = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { bio: searchRegex },
        { location: searchRegex },
      ],
    };

    const [data, total] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(searchQuery).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFirst10Users(): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password')
      .limit(10)
      .exec();
  }

  async getUserSessionStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    hostedSessions: number;
    participatedSessions: number;
  }> {
    const [totalSessions, completedSessions, hostedSessions, participatedSessions] = await Promise.all([
      // Total sessions (hosted or participated)
      this.sessionModel.countDocuments({
        $or: [
          { hostId: userId },
          { participants: userId }
        ]
      }),
      
      // Completed sessions
      this.sessionModel.countDocuments({
        $and: [
          {
            $or: [
              { hostId: userId },
              { participants: userId }
            ]
          },
          { status: 'completed' }
        ]
      }),
      
      // Hosted sessions
      this.sessionModel.countDocuments({
        hostId: userId
      }),
      
      // Participated sessions (not hosted)
      this.sessionModel.countDocuments({
        participants: userId,
        hostId: { $ne: userId }
      })
    ]);

    return {
      totalSessions,
      completedSessions,
      hostedSessions,
      participatedSessions
    };
  }
}