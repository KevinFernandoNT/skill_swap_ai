import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ enum: ['text', 'image', 'file'], default: 'text' })
  @IsOptional()
  @IsEnum(['text', 'image', 'file'])
  type?: string = 'text';
}