import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  private readonly logger = new Logger(SessionsController.name);

  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async create(@Request() req, @Body() createSessionDto: CreateSessionDto) {
    this.logger.log(`Received session creation request from user: ${req.user._id}`);
    this.logger.log(`Request body: ${JSON.stringify(createSessionDto)}`);
    
    const result = await this.sessionsService.create(req.user._id, createSessionDto);
    
    this.logger.log(`Session creation completed successfully`);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions for current user' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  async findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.sessionsService.findByUserId(req.user._id, paginationDto);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public sessions' })
  @ApiResponse({ status: 200, description: 'Public sessions retrieved successfully' })
  async findPublic(@Query() paginationDto: PaginationDto) {
    return this.sessionsService.findPublic(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search sessions by title or skill category' })
  @ApiResponse({ status: 200, description: 'Search results retrieved' })
  async search(
    @Query('q') query: string,
    @Query('status') status?: string,
    @Query() paginationDto?: PaginationDto,
  ) {
    return this.sessionsService.search(query, status, paginationDto);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming sessions for the next 3 days' })
  @ApiResponse({ status: 200, description: 'Upcoming sessions retrieved successfully' })
  async getUpcomingSessions(@Request() req, @Query() paginationDto?: PaginationDto) {
    this.logger.log(`Fetching upcoming sessions for user: ${req.user._id}`);
    return this.sessionsService.findUpcomingSessions(req.user._id, paginationDto);
  }

  @Get('suggested')
  @ApiOperation({ summary: 'Get suggested sessions based on current user skills' })
  @ApiResponse({ status: 200, description: 'Suggested sessions retrieved successfully' })
  async getSuggestedSessions(@Request() req) {
    return this.sessionsService.getSuggestedSessions(req.user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update session' })
  @ApiResponse({ status: 200, description: 'Session updated successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async update(@Request() req, @Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(req.user._id, id, updateSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete session' })
  @ApiResponse({ status: 200, description: 'Session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.sessionsService.remove(req.user._id, id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a session' })
  @ApiResponse({ status: 200, description: 'Successfully joined session' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async joinSession(@Request() req, @Param('id') id: string) {
    return this.sessionsService.joinSession(req.user._id, id);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave a session' })
  @ApiResponse({ status: 200, description: 'Successfully left session' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async leaveSession(@Request() req, @Param('id') id: string) {
    return this.sessionsService.leaveSession(req.user._id, id);
  }
}