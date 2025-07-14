import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExchangeRequestsService } from './exchange-requests.service';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { UpdateExchangeRequestDto } from './dto/update-exchange-request.dto';

@ApiTags('Exchange Requests')
@Controller('exchange-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Update exchange request status or message' })
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateExchangeRequestDto) {
    return this.service.update(req.user._id, id, dto);
  }
} 