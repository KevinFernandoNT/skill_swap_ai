import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class SkillsRepository {
  constructor(@InjectModel(Skill.name) private skillModel: Model<SkillDocument>) {}

  async create(createSkillDto: CreateSkillDto & { userId: string }): Promise<Skill> {
    const skill = new this.skillModel(createSkillDto);
    return skill.save();
  }

  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<PaginatedResult<Skill>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.skillModel
        .find({ userId })
        .populate('userId', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.skillModel.countDocuments({ userId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Skill | null> {
    return this.skillModel.findById(id).populate('userId', 'name email avatar').exec();
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill | null> {
    return this.skillModel
      .findByIdAndUpdate(id, updateSkillDto, { new: true })
      .populate('userId', 'name email avatar')
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.skillModel.findByIdAndDelete(id).exec();
  }

  async search(query: string, type?: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Skill>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');
    const searchQuery: any = {
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ],
    };

    if (type && ['teaching', 'learning'].includes(type)) {
      searchQuery.type = type;
    }

    const [data, total] = await Promise.all([
      this.skillModel
        .find(searchQuery)
        .populate('userId', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.skillModel.countDocuments(searchQuery).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}