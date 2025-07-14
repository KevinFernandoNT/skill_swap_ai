import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExchangeRequestDto {
  @ApiPropertyOptional({ enum: ['pending', 'accepted', 'rejected', 'cancelled'] })
  @IsOptional()
  @IsEnum(['pending', 'accepted', 'rejected', 'cancelled'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
} 