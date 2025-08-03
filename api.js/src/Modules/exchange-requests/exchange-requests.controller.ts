import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExchangeRequestsService } from './exchange-requests.service';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Exchange Requests')
@Controller('exchange-requests')
@UseGuards(JwtAuthGuard)
export class ExchangeRequestsController {
  constructor(private readonly service: ExchangeRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exchange request' })
  @ApiResponse({ status: 201, description: 'Exchange request created successfully' })
  async create(@Request() req, @Body() dto: CreateExchangeRequestDto) {
    return this.service.create(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exchange requests for current user' })
  @ApiResponse({ status: 200, description: 'Exchange requests retrieved successfully' })
  async findByUser(@Request() req) {
    return this.service.findByUserId(req.user._id);
  }

  @Get('hosted-sessions')
  @ApiOperation({ summary: 'Get exchange requests for sessions hosted by current user' })
  @ApiResponse({ status: 200, description: 'Hosted session exchange requests retrieved successfully' })
  async findBySessionHost(@Request() req) {
    return this.service.findBySessionHostId(req.user._id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all exchange requests (admin/debug)' })
  async findAll() {
    return this.service.findAll();
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get all exchange requests for a session' })
  async findBySession(@Param('sessionId') sessionId: string) {
    return this.service.findBySessionId(sessionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exchange request status' })
  @ApiResponse({ status: 200, description: 'Exchange request updated successfully' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateExchangeRequestDto, @Request() req) {
    if (!dto.status) {
      throw new BadRequestException('Status is required');
    }
    return this.service.updateStatus(id, dto.status);
  }
} 