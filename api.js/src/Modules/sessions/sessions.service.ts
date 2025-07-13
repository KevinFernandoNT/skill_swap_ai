import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Session } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async create(userId: string, createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionsRepository.create({ ...createSessionDto, hostId: userId });
  }

  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Session>> {
    return this.sessionsRepository.findByUserId(userId, paginationDto);
  }

  async findPublic(paginationDto: PaginationDto): Promise<PaginatedResult<Session>> {
    return this.sessionsRepository.findPublic(paginationDto);
  }

  async findById(id: string): Promise<Session> {
    const session = await this.sessionsRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async update(userId: string, id: string, updateSessionDto: UpdateSessionDto): Promise<Session | null> {
    const session = await this.sessionsRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.hostId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own sessions');
    }
    
    const updatedSession = await this.sessionsRepository.update(id, updateSessionDto);
    return updatedSession;
  }

  async remove(userId: string, id: string): Promise<void> {
    const session = await this.sessionsRepository.findById(id);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    if (session.hostId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own sessions');
    }
    
    await this.sessionsRepository.remove(id);
  }

  async search(query: string, status?: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Session>> {
    return this.sessionsRepository.search(query, status, paginationDto);
  }

  async joinSession(userId: string, sessionId: string): Promise<Session | null> {
    const session = await this.sessionsRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    
    if (session.hostId.toString() === userId) {
      throw new BadRequestException('You cannot join your own session');
    }
    
    if (session.participants.includes(userId as any)) {
      throw new BadRequestException('You are already a participant in this session');
    }
    
    if (session.maxParticipants && session.participants.length >= session.maxParticipants) {
      throw new BadRequestException('Session is full');
    }
    
    return this.sessionsRepository.addParticipant(sessionId, userId);
  }

  async leaveSession(userId: string, sessionId: string): Promise<Session | null> {
    const session = await this.sessionsRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    
    if (!session.participants.includes(userId as any)) {
      throw new BadRequestException('You are not a participant in this session');
    }
    
    return this.sessionsRepository.removeParticipant(sessionId, userId);
  }
}