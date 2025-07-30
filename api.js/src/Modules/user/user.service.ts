import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(createUserDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    return this.usersRepository.findAll(paginationDto);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async search(query: string, paginationDto: PaginationDto): Promise<PaginatedResult<User>> {
    return this.usersRepository.search(query, paginationDto);
  }

  async getFirst10Users(): Promise<User[]> {
    return this.usersRepository.getFirst10Users();
  }

  async getUserStats(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get session statistics
    const sessionStats = await this.usersRepository.getUserSessionStats(userId);
    
    // Calculate rating (mock data for now, can be enhanced with actual rating system)
    const rating = 4.5 + (Math.random() * 0.5); // Random rating between 4.5-5.0
    
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        location: user.location,
        bio: user.bio,
        createdAt: user.createdAt
      },
      stats: {
        rating: parseFloat(rating.toFixed(1)),
        totalSessions: sessionStats.totalSessions,
        completedSessions: sessionStats.completedSessions,
        hostedSessions: sessionStats.hostedSessions,
        participatedSessions: sessionStats.participatedSessions
      }
    };
  }
}