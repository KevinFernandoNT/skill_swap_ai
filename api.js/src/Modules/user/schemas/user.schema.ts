import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({ required: false })
  @Prop()
  location?: string;

  @ApiProperty({ required: false })
  @Prop({ default: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150' ,required:true})
  avatar: string;

  @ApiProperty({ required: false })
  @Prop()
  bio?: string;

  @ApiProperty({ required: false, enum: ['online', 'offline', 'busy', 'away'] })
  @Prop({ enum: ['online', 'offline', 'busy', 'away'], default: 'offline' })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  _id:ObjectId
}

export const UserSchema = SchemaFactory.createForClass(User);