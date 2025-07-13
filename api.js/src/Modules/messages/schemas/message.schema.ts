import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @ApiProperty()
  @Prop({ required: true })
  content: string;

  @ApiProperty({ enum: ['text', 'image', 'file'] })
  @Prop({ enum: ['text', 'image', 'file'], default: 'text' })
  type: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @ApiProperty({ default: false })
  @Prop({ default: false })
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);