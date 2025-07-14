import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExchangeRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  offeredSkill: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestedSkill: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
} 