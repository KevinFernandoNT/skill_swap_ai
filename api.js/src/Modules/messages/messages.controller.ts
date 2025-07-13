import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  async getConversations(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.messagesService.getConversations(req.user.id, paginationDto);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages from a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.messagesService.getMessages(conversationId, paginationDto);
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(req.user.id, conversationId, createMessageDto);
  }

  // Stream Chat integration endpoints
  @Get('stream/token')
  @ApiOperation({ summary: 'Generate Stream Chat user token' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  async generateStreamToken(@Request() req) {
    const token = await this.messagesService.generateUserToken(req.user.id);
    return { token };
  }

  @Get('stream/channels')
  @ApiOperation({ summary: 'Get user Stream Chat channels' })
  @ApiResponse({ status: 200, description: 'Channels retrieved successfully' })
  async getStreamChannels(@Request() req) {
    return this.messagesService.getUserStreamChannels(req.user.id);
  }

  @Post('stream/channels/:channelId/messages')
  @ApiOperation({ summary: 'Send a message to a Stream Chat channel' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendStreamMessage(
    @Request() req,
    @Param('channelId') channelId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.sendStreamMessage(
      channelId,
      req.user.id,
      createMessageDto.content,
    );
  }

  @Post('stream/channels')
  @ApiOperation({ summary: 'Create or get a Stream Chat channel between two users' })
  @ApiResponse({ status: 201, description: 'Channel created/retrieved successfully' })
  async createStreamChannel(
    @Request() req,
    @Body() body: { participantId: string },
  ) {
    return this.messagesService.getOrCreateStreamChannel(req.user.id, body.participantId);
  }
}