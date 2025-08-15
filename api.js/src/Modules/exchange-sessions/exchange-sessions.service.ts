import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExchangeSessionsRepository } from './exchange-sessions.repository';
import { CreateExchangeSessionDto } from './dto/create-exchange-session.dto';
import { UpdateExchangeSessionDto } from './dto/update-exchange-session.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { ExchangeSession, ExchangeSessionDocument } from './schemas/exchange-session.schema';
import { Skill, SkillDocument } from '../skills/schemas/skill.schema';
import { NotificationsService } from '../notifications/notifications.service';
import mongoose from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ExchangeSessionsService {
  private readonly logger = new Logger(ExchangeSessionsService.name);

  constructor(
    private readonly exchangeSessionsRepository: ExchangeSessionsRepository,
    @InjectModel(Skill.name) private readonly skillModel: Model<SkillDocument>,
    @InjectModel(ExchangeSession.name) private readonly exchangeSessionModel: Model<ExchangeSessionDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createExchangeSessionDto: CreateExchangeSessionDto): Promise<ExchangeSession> {
    this.logger.log(`Creating new exchange session for user: ${userId}`);
    this.logger.log(`Exchange session data: ${JSON.stringify(createExchangeSessionDto)}`);

    // Validate that skills exist
    await this.validateSkillsExist(createExchangeSessionDto.skillId, createExchangeSessionDto.requestedSkillId);

    const exchangeSession = await this.exchangeSessionsRepository.create({ 
      ...createExchangeSessionDto, 
      hostId: userId 
    });
    
    this.logger.log(`Exchange session created successfully with ID: ${(exchangeSession as any)._id}`);
    return exchangeSession;
  }

  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    return this.exchangeSessionsRepository.findByUserId(userId, paginationDto);
  }

  async findUpcomingExchangeSessions(userId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    this.logger.log(`Finding upcoming exchange sessions for user: ${userId}`);
    
    // Calculate date range for next 7 days using local timezone (avoid UTC off-by-one)
    const formatLocalYMD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const sevenDaysFromNow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    const todayStr = formatLocalYMD(today);
    const sevenDaysStr = formatLocalYMD(sevenDaysFromNow);
    
    this.logger.log(`Date range: ${todayStr} to ${sevenDaysStr}`);
    
    return this.exchangeSessionsRepository.findUpcomingExchangeSessions(userId, todayStr, sevenDaysStr, paginationDto);
  }

  async findUpcomingExchangeSessionsForDashboard(userId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    this.logger.log(`Finding upcoming exchange sessions for dashboard for user: ${userId}`);
    
    // Calculate date range for next 3 days (for dashboard) using local timezone
    const formatLocalYMD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const threeDaysFromNow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);

    const todayStr = formatLocalYMD(today);
    const threeDaysStr = formatLocalYMD(threeDaysFromNow);
    
   console.log(`Dashboard date range: ${todayStr} to ${threeDaysStr}`);
    
    return this.exchangeSessionsRepository.findUpcomingExchangeSessions(userId, todayStr, threeDaysStr, paginationDto);
  }

  async findPublic(paginationDto: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    return this.exchangeSessionsRepository.findPublic(paginationDto);
  }

  async findById(id: string): Promise<ExchangeSession> {
    const exchangeSession = await this.exchangeSessionsRepository.findById(id);
    if (!exchangeSession) {
      throw new NotFoundException('Exchange session not found');
    }
    return exchangeSession;
  }

  async update(userId: string, id: string, updateExchangeSessionDto: UpdateExchangeSessionDto): Promise<ExchangeSession | null> {
    const exchangeSession = await this.exchangeSessionsRepository.findById(id);
    if (!exchangeSession) {
      throw new NotFoundException('Exchange session not found');
    }

    // Check if user is the host or the one who requested the exchange
    if (exchangeSession.hostId._id.toString() !== userId.toString() && 
        exchangeSession.requestedBy._id.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only update exchange sessions you created or requested');
    }

    // Validate skills if they are being updated
    if (updateExchangeSessionDto.skillId || updateExchangeSessionDto.requestedSkillId) {
      const skillId = updateExchangeSessionDto.skillId || exchangeSession.skillId.toString();
      const requestedSkillId = updateExchangeSessionDto.requestedSkillId || exchangeSession.requestedSkillId.toString();
      await this.validateSkillsExist(skillId, requestedSkillId);
    }
    
    const updatedSession = await this.exchangeSessionsRepository.update(id, updateExchangeSessionDto);
    
    // Create notification if session is being marked as completed
    if (updateExchangeSessionDto.status === 'completed' && exchangeSession.status !== 'completed') {
      await this.createCompletionNotification(exchangeSession, userId);
    }
    
    return updatedSession;
  }

  async expirePendingSessionsNow(): Promise<number> {
    // Set status to 'expired' for sessions where status is 'upcoming' and start datetime < now
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0,5);
    // Note: implement in repository using an updateMany with date < today OR (date == today AND startTime < currentTime)
    const result = await (this.exchangeSessionsRepository as any).expirePendingSessions(todayStr, currentTime);
    return result;
  }

  // Run every day at 6:00 AM server time
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async expirePendingSessionsCron() {
    try {
      this.logger.log('Running cron to expire pending exchange sessions');
      const modified = await this.expirePendingSessionsNow();
      this.logger.log(`Expired ${modified} pending exchange sessions`);
    } catch (error) {
      this.logger.error('Error expiring pending exchange sessions', error as any);
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    const exchangeSession = await this.exchangeSessionsRepository.findById(id);
    if (!exchangeSession) {
      throw new NotFoundException('Exchange session not found');
    }
    
    // Check if user is the host or the one who requested the exchange
    if (exchangeSession.hostId._id.toString() !== userId.toString() && 
        exchangeSession.requestedBy._id.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only delete exchange sessions you created or requested');
    }
    
    await this.exchangeSessionsRepository.remove(id);
  }

  async search(query: string, status?: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    return this.exchangeSessionsRepository.search(query, status, paginationDto);
  }

  async findBySkillExchange(skillId: string, requestedSkillId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<ExchangeSession>> {
    // Validate that skills exist
    await this.validateSkillsExist(skillId, requestedSkillId);
    
    return this.exchangeSessionsRepository.findBySkillExchange(skillId, requestedSkillId, paginationDto);
  }

  async getStats(userId: string) {
    this.logger.log(`Calculating exchange session statistics for user: ${userId}`);

    try {
      // Get all exchange sessions where the user is either host or participant
   
      
      // Get all sessions where user is host or requested by user
      const allSessions = await this.exchangeSessionModel.find({
        $or: [
          { hostId: userId.toString() },
          { requestedBy: userId.toString() }
        ]
      }).populate('hostId', 'name avatar')
        .populate('requestedBy', 'name avatar')
        .exec();

      // Calculate completed sessions
      const completedSessions = allSessions.filter(session => session.status === 'completed');
      const completedCount = completedSessions.length;

      // Calculate scheduled (upcoming) sessions
      const scheduledSessions = allSessions.filter(session => session.status === 'upcoming');
      const scheduledCount = scheduledSessions.length;

      // Calculate unique exchange partners (users who had exchange sessions with current user)
      const uniquePartners = new Set();
      const partnerSessions = new Map(); // Map to store partner ID -> most recent session
      
      completedSessions.forEach(session => {
        let partnerId: string | undefined;
        let partnerData: any;
        
        // If user is host, add the requester as partner
        if (session.hostId._id.toString() === userId.toString()) {
          partnerId = session.requestedBy._id.toString();
          partnerData = session.requestedBy;
        }
        // If user is requester, add the host as partner
        else if (session.requestedBy._id.toString() === userId.toString()) {
          partnerId = session.hostId._id.toString();
          partnerData = session.hostId;
        }
        
        if (partnerId) {
          uniquePartners.add(partnerId);
          // Store the most recent session for each partner
          if (!partnerSessions.has(partnerId) || 
              new Date(session.updatedAt) > new Date(partnerSessions.get(partnerId).updatedAt)) {
            partnerSessions.set(partnerId, {
              partner: partnerData,
              session: session
            });
          }
        }
      });

      const uniquePartnersCount = uniquePartners.size;

      // Get the 4 most recently connected partners
      const recentPartners = Array.from(partnerSessions.values())
        .sort((a, b) => new Date(b.session.updatedAt).getTime() - new Date(a.session.updatedAt).getTime())
        .slice(0, 4)
        .map(item => ({
          _id: item.partner._id,
          name: item.partner.name,
          avatar: item.partner.avatar
        }));

      console.log(`Stats calculated - Completed: ${completedCount}, Scheduled: ${scheduledCount}, Unique Partners: ${uniquePartnersCount}`);

      return {
        success: true,
        data: {
          completedExchangeSessions: completedCount,
          scheduledExchangeSessions: scheduledCount,
          uniqueExchangePartners: uniquePartnersCount,
          recentExchangePartners: recentPartners
        }
      };
    } catch (error) {
      this.logger.error(`Error calculating stats for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create notification when exchange session is completed
   */
  private async createCompletionNotification(exchangeSession: ExchangeSession, completedByUserId: string): Promise<void> {
    try {
      // Determine who should receive the notification (the other user in the exchange)
      let recipientId: string;
      let senderName: string;
      
      // Cast to any to access populated fields
      const session = exchangeSession as any;
      
      if (session.hostId._id.toString() === completedByUserId.toString()) {
        // Host completed the session, notify the requester
        recipientId = session.requestedBy._id;
        senderName = session.hostId.name;
      } else {
        // Requester completed the session, notify the host
        recipientId = session.hostId._id;
        senderName = session.requestedBy.name;
      }

      // Create the notification
      await this.notificationsService.create({
        recipient: recipientId,
        sender: completedByUserId,
        title: 'Exchange Session Completed',
        message: `${senderName} marked the exchange session "${exchangeSession.title}" as completed.`,
        type: 'exchange_session_completed',
        isRead: false,
        isDeleted: false
      });

      this.logger.log(`Notification created for user ${recipientId} about completed exchange session ${(exchangeSession as any)._id}`);
    } catch (error) {
      this.logger.error(`Error creating completion notification: ${error.message}`);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Validate that both skills exist in the database
   */
  private async validateSkillsExist(skillId: string, requestedSkillId: string): Promise<void> {
    const [skill, requestedSkill] = await Promise.all([
      this.skillModel.findById(skillId).exec(),
      this.skillModel.findById(requestedSkillId).exec(),
    ]);

    if (!skill) {
      throw new BadRequestException(`Skill with ID ${skillId} not found`);
    }

    if (!requestedSkill) {
      throw new BadRequestException(`Requested skill with ID ${requestedSkillId} not found`);
    }
  }
} 