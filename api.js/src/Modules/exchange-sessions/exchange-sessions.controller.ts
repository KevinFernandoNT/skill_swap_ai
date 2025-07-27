import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExchangeSessionsService } from './exchange-sessions.service';
import { CreateExchangeSessionDto } from './dto/create-exchange-session.dto';
import { UpdateExchangeSessionDto } from './dto/update-exchange-session.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Exchange Sessions')
@Controller('exchange-sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExchangeSessionsController {
  private readonly logger = new Logger(ExchangeSessionsController.name);

  constructor(private readonly exchangeSessionsService: ExchangeSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exchange session' })
  @ApiResponse({ status: 201, description: 'Exchange session created successfully' })
  async create(@Request() req, @Body() createExchangeSessionDto: CreateExchangeSessionDto) {
    this.logger.log(`Received exchange session creation request from user: ${req.user._id}`);
    this.logger.log(`Request body: ${JSON.stringify(createExchangeSessionDto)}`);
    
    const result = await this.exchangeSessionsService.create(req.user._id, createExchangeSessionDto);
    
    this.logger.log(`Exchange session creation completed successfully`);
    return result;
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get exchange session statistics for current user' })
  @ApiResponse({ status: 200, description: 'Exchange session statistics retrieved successfully' })
  async getStats(@Request() req) {
    this.logger.log(`Fetching exchange session statistics for user: ${req.user._id}`);
    return this.exchangeSessionsService.getStats(req.user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exchange sessions for current user' })
  @ApiResponse({ status: 200, description: 'Exchange sessions retrieved successfully' })
  async findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.exchangeSessionsService.findByUserId(req.user._id, paginationDto);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public exchange sessions' })
  @ApiResponse({ status: 200, description: 'Public exchange sessions retrieved successfully' })
  async findPublic(@Query() paginationDto: PaginationDto) {
    return this.exchangeSessionsService.findPublic(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search exchange sessions by title or skill category' })
  @ApiResponse({ status: 200, description: 'Search results retrieved' })
  async search(
    @Query('q') query: string,
    @Query('status') status?: string,
    @Query() paginationDto?: PaginationDto,
  ) {
    return this.exchangeSessionsService.search(query, status, paginationDto);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming exchange sessions for the next 7 days' })
  @ApiResponse({ status: 200, description: 'Upcoming exchange sessions retrieved successfully' })
  async getUpcomingExchangeSessions(@Request() req, @Query() paginationDto?: PaginationDto) {
    this.logger.log(`Fetching upcoming exchange sessions for user: ${req.user._id}`);
    return this.exchangeSessionsService.findUpcomingExchangeSessions(req.user._id, paginationDto);
  }

  @Get('upcoming-dashboard')
  @ApiOperation({ summary: 'Get upcoming exchange sessions for the next 3 days (Dashboard)' })
  @ApiResponse({ status: 200, description: 'Upcoming exchange sessions for dashboard retrieved successfully' })
  async getUpcomingExchangeSessionsForDashboard(@Request() req, @Query() paginationDto?: PaginationDto) {
    this.logger.log(`Fetching upcoming exchange sessions for dashboard for user: ${req.user._id}`);
    return this.exchangeSessionsService.findUpcomingExchangeSessionsForDashboard(req.user._id, paginationDto);
  }

  @Get('by-skills/:skillId/:requestedSkillId')
  @ApiOperation({ summary: 'Find exchange sessions by skill exchange pair' })
  @ApiResponse({ status: 200, description: 'Exchange sessions by skill pair retrieved successfully' })
  async findBySkillExchange(
    @Param('skillId') skillId: string,
    @Param('requestedSkillId') requestedSkillId: string,
    @Query() paginationDto?: PaginationDto,
  ) {
    return this.exchangeSessionsService.findBySkillExchange(skillId, requestedSkillId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exchange session by ID' })
  @ApiResponse({ status: 200, description: 'Exchange session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Exchange session not found' })
  async findOne(@Param('id') id: string) {
    return this.exchangeSessionsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update exchange session' })
  @ApiResponse({ status: 200, description: 'Exchange session updated successfully' })
  @ApiResponse({ status: 404, description: 'Exchange session not found' })
  async update(@Request() req, @Param('id') id: string, @Body() updateExchangeSessionDto: UpdateExchangeSessionDto) {
    return this.exchangeSessionsService.update(req.user._id, id, updateExchangeSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exchange session' })
  @ApiResponse({ status: 200, description: 'Exchange session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exchange session not found' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.exchangeSessionsService.remove(req.user._id, id);
  }
} 