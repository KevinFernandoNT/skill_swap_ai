import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SkillsRepository } from './skills.repository';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { Skill } from './schemas/skill.schema';

@Injectable()
export class SkillsService {
  constructor(private readonly skillsRepository: SkillsRepository) {}

  async create(userId: string, createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillsRepository.create({ ...createSkillDto, userId });
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
    if (skill.userId.toString() !== userId) {
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
    if (skill.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own skills');
    }
    
    await this.skillsRepository.remove(id);
  }

  async search(query: string, type?: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Skill>> {
    return this.skillsRepository.search(query, type, paginationDto);
  }
}