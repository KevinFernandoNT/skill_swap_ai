import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
  offeredSkillId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestedSkillId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;
} 