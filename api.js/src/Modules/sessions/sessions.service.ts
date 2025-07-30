import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionsRepository } from './sessions.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Session } from './schemas/session.schema';
import { Skill, SkillDocument } from '../skills/schemas/skill.schema';
import { ExternalHttpService } from '../common/http.service';
import { PythonApiService } from '../common/python-api.service';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly sessionsRepository: SessionsRepository,
    @InjectModel(Skill.name) private readonly skillModel: Model<SkillDocument>,
    private readonly externalHttpService: ExternalHttpService,
    private readonly pythonApiService: PythonApiService,
  ) {}

  async create(userId: string, createSessionDto: CreateSessionDto): Promise<Session> {
    this.logger.log(`Creating new session for user: ${userId}`);
    this.logger.log(`Session data: ${JSON.stringify(createSessionDto)}`);

    // Create the session first
    const session = await this.sessionsRepository.create({ ...createSessionDto, hostId: userId });
    this.logger.log(`Session created successfully with ID: ${(session as any)._id}`);

    // Trigger background process if we have teachSkillId and focusKeywords
    if (createSessionDto.teachSkillId && createSessionDto.subTopics && createSessionDto.subTopics.length > 0) {
      this.logger.log(`Triggering background process for session: ${(session as any)._id}`);
      this.logger.log(`teachSkillId: ${createSessionDto.teachSkillId}`);
      this.logger.log(`focusKeywords: ${JSON.stringify(createSessionDto.focusKeywords)}`);

      // Execute background process asynchronously
      this.triggerBackgroundProcess((session as any)._id, createSessionDto.teachSkillId, createSessionDto.subTopics);
    } else {
      this.logger.log(`Skipping background process - missing teachSkillId or focusKeywords`);
      this.logger.log(`teachSkillId: ${createSessionDto.teachSkillId}`);
      this.logger.log(`focusKeywords: ${JSON.stringify(createSessionDto.focusKeywords)}`);
    }

    return session;
  }

  /**
   * Trigger the background process to send session data to Python API
   * This method executes asynchronously and does not block the main request
   */
  private triggerBackgroundProcess(sessionId: string, teachSkillId: string, focusKeywords: string[]): void {
    this.logger.log(`Starting background process execution`);
    
    // Execute in the next tick to ensure it doesn't block the current request
    process.nextTick(async () => {
      try {
        this.logger.log(`Fetching skill data for ID: ${teachSkillId}`);
        
        // Fetch skill data from database
        const skill = await this.skillModel.findById(teachSkillId).exec();
        
        if (!skill) {
          this.logger.error(`Skill not found for ID: ${teachSkillId}`);
          return;
        }

        this.logger.log(`Skill found: ${skill.name} (Category: ${skill.category})`);
        
        // Send data to Python API with session ID
        this.logger.log(`Executing background process to Python API`);
        this.externalHttpService.executeBackgroundProcess(sessionId, skill.name, focusKeywords);
        
        this.logger.log(`Background process initiated successfully`);
      } catch (error) {
        this.logger.error(`Error in background process: ${error.message}`);
        this.logger.error(`Stack trace: ${error.stack}`);
      }
    });
  }

  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Session>> {
    return this.sessionsRepository.findByUserId(userId, paginationDto);
  }

  async findUpcomingSessions(userId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Session>> {
    this.logger.log(`Finding upcoming sessions for user: ${userId}`);
    
    // Calculate date range for next 3 days
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    // Format dates as YYYY-MM-DD strings
    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];
    
    this.logger.log(`Date range: ${todayStr} to ${threeDaysStr}`);
    
    return this.sessionsRepository.findUpcomingSessions(userId, todayStr, threeDaysStr, paginationDto);
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

    if (session.hostId._id.toString() !== userId.toString()) {
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
    if (session.hostId._id.toString() !== userId.toString()) {
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

  /**
   * Update session metadata (for background processes)
   * This method allows updating session metadata without user authorization
   */
  async updateSessionMetadata(sessionId: string, metadata: string[]): Promise<void> {
    this.logger.log(`Updating session metadata for session: ${sessionId}`);
    this.logger.log(`Metadata: ${JSON.stringify(metadata)}`);

    const session = await this.sessionsRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Update the session with the new metadata
    await this.sessionsRepository.update(sessionId, { metadata });
    
    this.logger.log(`Session metadata updated successfully for session: ${sessionId}`);
  }

  /**
   * Get suggested sessions based on current user's teachable and learnable skills
   */
  async getSuggestedSessions(userId: string) {
    this.logger.log(`Getting suggested sessions for user: ${userId}`);

    try {
      // Step 1: Get current user's learnable skills (type: 'learning') and their metadata
      const userLearningSkills = await this.skillModel.find({
        userId: userId,
        type: 'learning'
      }).exec();

      // Step 1b: Get current user's teachable skills (type: 'teaching') and their metadata
      const userTeachingSkills = await this.skillModel.find({
        userId: userId,
        type: 'teaching'
      }).exec();

      this.logger.log(`Found ${userLearningSkills.length} learning skills and ${userTeachingSkills.length} teaching skills for user`);

      const allSuggestedSessions = new Map();

      // ===========================================
      // PART 1: Find sessions that match user's learning needs
      // ===========================================
      if (userLearningSkills.length > 0) {
        this.logger.log('Processing learning skills to find matching sessions...');
        
        // Extract all metadata keywords from user's learning skills
        const learningMetadataKeywords = userLearningSkills
          .flatMap(skill => skill.metadata || [])
          .filter(keyword => keyword && keyword.trim() !== '');

        this.logger.log(`Extracted learning metadata keywords: ${JSON.stringify(learningMetadataKeywords)}`);

        if (learningMetadataKeywords.length > 0) {
          // Call Python API to get matching keywords for learning skills
          const learningMatchingKeywords = await this.pythonApiService.searchKeywords(learningMetadataKeywords);
          
          this.logger.log(`Python API returned learning matching keywords: ${JSON.stringify(learningMatchingKeywords)}`);

          if (learningMatchingKeywords.length > 0) {
            // Split each keyword by comma and flatten into a single array
            const expandedLearningKeywords = learningMatchingKeywords
              .flatMap(keyword => keyword.split(','))
              .map(keyword => keyword.trim())
              .filter(keyword => keyword !== '');

            this.logger.log(`Expanded learning keywords: ${JSON.stringify(expandedLearningKeywords)}`);

            // Find sessions that contain at least 2 of the expanded keywords in their metadata
            const matchingSessions = await this.sessionsRepository.findSessionsByKeywords(
              expandedLearningKeywords,
              userId, // Exclude current user's sessions
              2 // Minimum 2 keywords must match
            );

            this.logger.log(`Found ${matchingSessions.length} matching sessions for user's learning needs`);

                         // Add sessions to the suggested sessions map
             matchingSessions.forEach(session => {
               const sessionKey = (session as any)._id.toString();
               if (!allSuggestedSessions.has(sessionKey)) {
                 allSuggestedSessions.set(sessionKey, {
                   ...(session as any).toObject(),
                   matchingType: 'learning_match' // Sessions that match what user wants to learn
                 });
               }
             });
          }
        }
      }

      // ===========================================
      // PART 2: Find sessions that match user's teaching abilities
      // ===========================================
      if (userTeachingSkills.length > 0) {
        this.logger.log('Processing teaching skills to find matching sessions...');
        
        // Extract all metadata keywords from user's teaching skills
        const teachingMetadataKeywords = userTeachingSkills
          .flatMap(skill => skill.metadata || [])
          .filter(keyword => keyword && keyword.trim() !== '');

        this.logger.log(`Extracted teaching metadata keywords: ${JSON.stringify(teachingMetadataKeywords)}`);

        if (teachingMetadataKeywords.length > 0) {
          // Call Python API to get matching keywords for teaching skills
          const teachingMatchingKeywords = await this.pythonApiService.searchKeywords(teachingMetadataKeywords);
          
          this.logger.log(`Python API returned teaching matching keywords: ${JSON.stringify(teachingMatchingKeywords)}`);

          if (teachingMatchingKeywords.length > 0) {
            // Split each keyword by comma and flatten into a single array
            const expandedTeachingKeywords = teachingMatchingKeywords
              .flatMap(keyword => keyword.split(','))
              .map(keyword => keyword.trim())
              .filter(keyword => keyword !== '');

            this.logger.log(`Expanded teaching keywords: ${JSON.stringify(expandedTeachingKeywords)}`);

            // Find sessions that contain at least 2 of the expanded keywords in their metadata
            const matchingSessions = await this.sessionsRepository.findSessionsByKeywords(
              expandedTeachingKeywords,
              userId, // Exclude current user's sessions
              2 // Minimum 2 keywords must match
            );

            this.logger.log(`Found ${matchingSessions.length} matching sessions for user's teaching abilities`);

                         // Add sessions to the suggested sessions map
             matchingSessions.forEach(session => {
               const sessionKey = (session as any)._id.toString();
               if (!allSuggestedSessions.has(sessionKey)) {
                 allSuggestedSessions.set(sessionKey, {
                   ...(session as any).toObject(),
                   matchingType: 'teaching_match' // Sessions that match what user can teach
                 });
               } else {
                 // If session already exists, update matching type to indicate both scenarios
                 allSuggestedSessions.get(sessionKey).matchingType = 'mutual_match';
               }
             });
          }
        }
      }

      const suggestedSessions = Array.from(allSuggestedSessions.values());
      
      this.logger.log(`Returning ${suggestedSessions.length} total suggested sessions (from both learning and teaching matches)`);

      return {
        success: true,
        data: suggestedSessions
      };

    } catch (error) {
      this.logger.error(`Error getting suggested sessions for user ${userId}: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
}