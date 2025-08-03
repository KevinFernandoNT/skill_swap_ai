import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ExchangeRequestDocument = ExchangeRequest & Document;

@Schema({ timestamps: true })
export class ExchangeRequest {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Session', required: true })
  sessionId: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Skill', required: true })
  offeredSkillId: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Skill', required: true })
  requestedSkillId: Types.ObjectId;

  @ApiProperty({ required: false })
  @Prop()
  message?: string;

  @ApiProperty({ enum: ['pending', 'accepted', 'rejected', 'cancelled'] })
  @Prop({ enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const ExchangeRequestSchema = SchemaFactory.createForClass(ExchangeRequest); 