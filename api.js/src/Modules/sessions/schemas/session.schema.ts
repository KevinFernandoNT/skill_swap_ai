import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty({ required: false })
  @Prop()
  description?: string;

  @ApiProperty()
  @Prop({ required: true })
  date: string;

  @ApiProperty()
  @Prop({ required: true })
  startTime: string;

  @ApiProperty()
  @Prop({ required: true })
  endTime: string;

  @ApiProperty()
  @Prop({ required: true })
  skillCategory: string;

  @ApiProperty({ enum: ['upcoming', 'completed', 'cancelled'] })
  @Prop({ enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' })
  status: string;

  @ApiProperty()
  @Prop({ required: true })
  isTeaching: boolean;

  @ApiProperty({ required: false })
  @Prop()
  maxParticipants?: number;

  @ApiProperty({ required: false, default: false })
  @Prop({ default: false })
  isPublic?: boolean;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hostId: Types.ObjectId;

  @ApiProperty({ type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants: Types.ObjectId[];

  @ApiProperty({ required: true })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skill' }] })  
  teachSkillId?: Types.ObjectId;

  @ApiProperty({ required: false })
  @Prop()
  teachSkillName?: string;

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String], default: [] })
  subTopics?: string[];

  @ApiProperty({ required: false })
  @Prop()
  meetingLink?: string;

  @ApiProperty({ type: [String], required: false })
  @Prop({ type: [String], default: [] })
  focusKeywords?: string[];

  @ApiProperty({ required: false })
  @Prop({ type: [String], default: [], required: false })
  metadata?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);