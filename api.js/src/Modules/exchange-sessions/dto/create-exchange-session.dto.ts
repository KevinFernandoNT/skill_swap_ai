import { IsString, IsBoolean, IsOptional, IsNumber, IsDateString, Min, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExchangeSessionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsString()
  skillCategory: string;

  @ApiProperty()
  @IsBoolean()
  isTeaching: boolean;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxParticipants?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  subTopics?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meetingLink?: string;

  // New fields for exchange sessions
  @ApiProperty()
  @IsMongoId()
  skillId: string;

  @ApiProperty()
  @IsMongoId()
  requestedSkillId: string;

  @ApiProperty()
  @IsMongoId()
  requestedBy: string;
} 