import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillsRepository } from './skills.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { SkillsHttpService } from './skills-http.service';
import { PythonApiService } from '../common/python-api.service';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(
    private readonly skillsRepository: SkillsRepository,
    private readonly skillsHttpService: SkillsHttpService,
    private readonly pythonApiService: PythonApiService,
    @InjectModel(Skill.name) private readonly skillModel: Model<SkillDocument>,
  ) {}

  async create(userId: string, createSkillDto: CreateSkillDto): Promise<Skill> {
    this.logger.log(`Creating new skill for user: ${userId}`);
    this.logger.log(`Skill data: ${JSON.stringify(createSkillDto)}`);

    // Create the skill first
    const skill = await this.skillsRepository.create({ ...createSkillDto, userId });
    this.logger.log(`Skill created successfully with ID: ${(skill as any)._id}`);

    // Trigger background process if we have skill name and agenda
    if (createSkillDto.name && createSkillDto.agenda && createSkillDto.agenda.length > 0) {
      this.logger.log(`Triggering background process for skill: ${(skill as any)._id}`);
      this.logger.log(`Skill name: ${createSkillDto.name}`);
      this.logger.log(`Agenda: ${JSON.stringify(createSkillDto.agenda)}`);

      // Execute background process asynchronously
      this.triggerBackgroundProcess((skill as any)._id, createSkillDto.name, createSkillDto.agenda);
    } else {
      this.logger.log(`Skipping background process - missing skill name or agenda`);
      this.logger.log(`Skill name: ${createSkillDto.name}`);
      this.logger.log(`Agenda: ${JSON.stringify(createSkillDto.agenda)}`);
    }

    return skill;
  }

  /**
   * Trigger the background process to send skill data to Python API
   * This method executes asynchronously and does not block the main request
   */
  private triggerBackgroundProcess(skillId: string, skillName: string, agenda: string[]): void {
    this.logger.log(`Starting background process execution for skill: ${skillId}`);
    
    // Execute in the next tick to ensure it doesn't block the current request
    process.nextTick(async () => {
      try {
        this.logger.log(`Processing skill: ${skillName} with agenda: ${JSON.stringify(agenda)}`);
        
        // Send data to Python API with skill ID for metadata generation
        this.logger.log(`Executing background process to Python API for skill metadata`);
        this.skillsHttpService.executeBackgroundProcess(skillId, skillName, agenda);
        
        this.logger.log(`Background process initiated successfully for skill: ${skillId}`);
      } catch (error) {
        this.logger.error(`Error in background process for skill ${skillId}: ${error.message}`);
        this.logger.error(`Stack trace: ${error.stack}`);
      }
    });
  }

  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Skill>> {
    return this.skillsRepository.findByUserId(userId, paginationDto);
  }

  async findById(id: string): Promise<Skill> {
    const skill = await this.skillsRepository.findById(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  async update(userId: string, id: string, updateSkillDto: UpdateSkillDto): Promise<Skill | null> {
    const skill = await this.skillsRepository.findById(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    if (skill.userId._id.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only update your own skills');
    }
    
    const updatedSkill = await this.skillsRepository.update(id, updateSkillDto);
    return updatedSkill;
  }

  async remove(userId: string, id: string): Promise<void> {
    const skill = await this.skillsRepository.findById(id);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    if (skill.userId._id.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only delete your own skills');
    }
    
    await this.skillsRepository.remove(id);
  }

  async search(query: string, type?: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Skill>> {
    return this.skillsRepository.search(query, type, paginationDto);
  }

  /**
   * Update skill metadata (for background processes)
   * This method allows updating skill metadata without user authorization
   */
  async updateSkillMetadata(skillId: string, metadata: string[]): Promise<void> {
    this.logger.log(`Updating skill metadata for skill: ${skillId}`);
    this.logger.log(`Metadata: ${JSON.stringify(metadata)}`);

    const skill = await this.skillsRepository.findById(skillId);
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    // Update the skill with the new metadata
    await this.skillsRepository.update(skillId, { metadata });
    
    this.logger.log(`Skill metadata updated successfully for skill: ${skillId}`);
  }

  /**
   * Get suggested users based on current user's learning and teaching skills
   */
  async getSuggestedUsers(userId: string) {
    this.logger.log(`Getting suggested users for user: ${userId}`);

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

      const allSuggestedUsers = new Map();

      // ===========================================
      // PART 1: Find users who can teach what current user wants to learn
      // ===========================================
      if (userLearningSkills.length > 0) {
        this.logger.log('Processing learning skills to find potential teachers...');
        
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

            // Find all teachable skills that contain at least one expanded keyword
            const matchingTeachableSkills = await this.skillModel.find({
              type: 'teaching',
              userId: { $ne: userId }, // Exclude current user
              metadata: { $in: expandedLearningKeywords }
            })
            .populate('userId', 'name email avatar')
            .exec();

            this.logger.log(`Found ${matchingTeachableSkills.length} matching teachable skills for user's learning needs`);

            // Add users to the suggested users map
            matchingTeachableSkills.forEach(skill => {
              const user = skill.userId as any;
              if (user) {
                const userKey = user._id.toString();
                if (!allSuggestedUsers.has(userKey)) {
                  allSuggestedUsers.set(userKey, {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    matchingSkills: [],
                    matchingType: 'can_teach' // They can teach what user wants to learn
                  });
                }
                
                allSuggestedUsers.get(userKey).matchingSkills.push({
                  _id: skill._id,
                  name: skill.name,
                  category: skill.category,
                  proficiency: skill.proficiency,
                  description: skill.description,
                  metadata: skill.metadata,
                  agenda: skill.agenda, // Include agenda in the response
                  skillType: 'teaching'
                });
              }
            });
          }
        }
      }

      // ===========================================
      // PART 2: Find users who want to learn what current user can teach
      // ===========================================
      if (userTeachingSkills.length > 0) {
        this.logger.log('Processing teaching skills to find potential learners...');
        
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

            // Find all learnable skills that contain at least one expanded keyword
            const matchingLearnableSkills = await this.skillModel.find({
              type: 'learning',
              userId: { $ne: userId }, // Exclude current user
              metadata: { $in: expandedTeachingKeywords }
            })
            .populate('userId', 'name email avatar')
            .exec();

            this.logger.log(`Found ${matchingLearnableSkills.length} matching learnable skills for user's teaching abilities`);

            // Add users to the suggested users map
            matchingLearnableSkills.forEach(skill => {
              const user = skill.userId as any;
              if (user) {
                const userKey = user._id.toString();
                if (!allSuggestedUsers.has(userKey)) {
                  allSuggestedUsers.set(userKey, {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    matchingSkills: [],
                    matchingType: 'wants_to_learn' // They want to learn what user can teach
                  });
                } else {
                  // If user already exists, update matching type to indicate both scenarios
                  allSuggestedUsers.get(userKey).matchingType = 'mutual_match';
                }
                
                allSuggestedUsers.get(userKey).matchingSkills.push({
                  _id: skill._id,
                  name: skill.name,
                  category: skill.category,
                  proficiency: skill.proficiency,
                  description: skill.description,
                  metadata: skill.metadata,
                  agenda: skill.agenda, // Include agenda in the response
                  skillType: 'learning'
                });
              }
            });
          }
        }
      }

      const suggestedUsers = Array.from(allSuggestedUsers.values());
      
      this.logger.log(`Returning ${suggestedUsers.length} total suggested users (from both learning and teaching matches)`);

      return {
        success: true,
        data: suggestedUsers
      };

    } catch (error) {
      this.logger.error(`Error getting suggested users for user ${userId}: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
}