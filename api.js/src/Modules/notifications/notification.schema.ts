import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  message: string;

  @ApiProperty()
  @Prop({ required: true })
  type: string; // 'exchange_request_accepted', 'exchange_request_rejected', 'exchange_request_received', etc.

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'ExchangeRequest', required: false })
  exchangeRequestId?: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Session', required: false })
  sessionId?: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  sender?: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: false })
  isRead: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification); 