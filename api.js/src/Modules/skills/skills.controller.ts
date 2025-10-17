import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Skills')
@Controller('skills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async create(@Request() req, @Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(req.user._id, createSkillDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills for current user' })
  @ApiResponse({ status: 200, description: 'Skills retrieved successfully' })
  async findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.skillsService.findByUserId(req.user._id, paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search skills by name or category' })
  @ApiResponse({ status: 200, description: 'Search results retrieved' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query() paginationDto?: PaginationDto,
  ) {
    return this.skillsService.search(query, type, paginationDto);
  }

  @Get('suggested-users')
  @ApiOperation({ summary: 'Get suggested users based on current user learning skills' })
  @ApiResponse({ status: 200, description: 'Suggested users retrieved successfully' })
  async getSuggestedUsers(@Request() req) {
    return this.skillsService.getSuggestedUsers(req.user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async findOne(@Param('id') id: string) {
    return this.skillsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update skill' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async update(@Request() req, @Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(req.user._id, id, updateSkillDto);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all skills for current user' })
  @ApiResponse({ status: 200, description: 'All skills deleted successfully' })
  async removeAll(@Request() req) {
    console.log('RemoveAll - Request user object:', req.user);
    console.log('RemoveAll - User ID:', req.user?._id);
    console.log('RemoveAll - User ID type:', typeof req.user?._id);
    
    if (!req.user || !req.user._id) {
      console.error('RemoveAll - No user found in request');
      throw new Error('User not authenticated');
    }
    
    return this.skillsService.removeAll(req.user._id);
  }

  @Delete('all/teaching')
  @ApiOperation({ summary: 'Delete all teaching skills for current user' })
  @ApiResponse({ status: 200, description: 'All teaching skills deleted successfully' })
  async removeAllTeaching(@Request() req) {
    console.log('RemoveAllTeaching - Request user object:', req.user);
    console.log('RemoveAllTeaching - User ID:', req.user?._id);
    
    if (!req.user || !req.user._id) {
      console.error('RemoveAllTeaching - No user found in request');
      throw new Error('User not authenticated');
    }
    
    return this.skillsService.removeAllByType(req.user._id, 'teaching');
  }

  @Delete('all/learning')
  @ApiOperation({ summary: 'Delete all learning skills for current user' })
  @ApiResponse({ status: 200, description: 'All learning skills deleted successfully' })
  async removeAllLearning(@Request() req) {
    console.log('RemoveAllLearning - Request user object:', req.user);
    console.log('RemoveAllLearning - User ID:', req.user?._id);
    
    if (!req.user || !req.user._id) {
      console.error('RemoveAllLearning - No user found in request');
      throw new Error('User not authenticated');
    }
    
    return this.skillsService.removeAllByType(req.user._id, 'learning');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.skillsService.remove(req.user._id, id);
  }
}