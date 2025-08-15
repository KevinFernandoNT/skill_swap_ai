import { Injectable } from '@nestjs/common';
import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { ExchangeSessionsService } from '../exchange-sessions/exchange-sessions.service';
import { SessionsService } from '../sessions/sessions.service';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange-request.dto';
import { Types } from 'mongoose';

@Injectable()
export class ExchangeRequestsService {
  constructor(
    private repo: ExchangeRequestsRepository,
    private notificationsService: NotificationsService,
    private exchangeSessionsService: ExchangeSessionsService,
    private sessionsService: SessionsService
  ) {}

  async create(userId: string, dto: CreateExchangeRequestDto) {
    return this.repo.create({
      ...dto,
      sessionId: new Types.ObjectId(dto.sessionId),
      requester: new Types.ObjectId(userId),
      recipient: new Types.ObjectId(dto.recipient),
      offeredSkillId: new Types.ObjectId(dto.offeredSkillId),
      requestedSkillId: new Types.ObjectId(dto.requestedSkillId),
      status: 'pending',
    });
  }

  async findByUserId(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async findBySessionHostId(hostId: string) {
    return this.repo.findBySessionHostId(hostId);
  }

  async findBySessionId(sessionId: string) {
    return this.repo.findBySessionId(sessionId);
  }

  async updateStatus(id: string, status: string) {
    const updatedRequest = await this.repo.updateStatus(id, status);
    
    // Create notification if status is accepted or rejected
    if (updatedRequest && (status === 'accepted' || status === 'rejected')) {
      // Get the exchange request to get basic information
      const exchangeRequest = await this.repo.findById(id);
      if (exchangeRequest) {
        // Create notification with basic information
        await this.notificationsService.create({
          recipient: exchangeRequest.requester,
          sender: exchangeRequest.recipient,
          exchangeRequestId: new Types.ObjectId(id),
          sessionId: exchangeRequest.sessionId,
          title: `Exchange Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
          message: `Your exchange request has been ${status}.`,
          type: `exchange_request_${status}`,
          isRead: false,
          isDeleted: false
        });

        // Create exchange session if request is accepted
        if (status === 'accepted') {
          await this.createExchangeSessionFromRequest(exchangeRequest);
        }
      }
    }
    
    return updatedRequest;
  }

  private async createExchangeSessionFromRequest(exchangeRequest: any) {
    try {
      // Get the original session to preserve its meeting link and other details
      const originalSession = await this.sessionsService.findById(exchangeRequest.sessionId.toString());
      
      // Create exchange session with data from the original session and exchange request
      const exchangeSessionData = {
        title: `Exchange Session`,
        description: `Skill exchange session based on accepted request`,
        date: originalSession.date,
        startTime: originalSession.startTime,
        endTime: originalSession.endTime,
        skillCategory: originalSession.skillCategory,
        isTeaching: true, // Exchange sessions are teaching sessions
        maxParticipants: 2, // Exchange sessions are typically 1-on-1
        isPublic: false, // Exchange sessions are private
        skillId: exchangeRequest.offeredSkillId.toString(),
        requestedSkillId: exchangeRequest.requestedSkillId.toString(),
        requestedBy: exchangeRequest.requester.toString(),
        subTopics: originalSession.subTopics || [],
        meetingLink: exchangeRequest.meetingLink || originalSession.meetingLink || '',
        focusKeywords: originalSession.focusKeywords || []
      };

      // Create the exchange session
      await this.exchangeSessionsService.create(
        exchangeRequest.recipient.toString(), // Host is the recipient (session host)
        exchangeSessionData
      );
    } catch (error) {
      console.error('Error creating exchange session:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }
} 