import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SkillDocument = Skill & Document;

@Schema({ timestamps: true })
export class Skill {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  category: string;

  @ApiProperty()
  @Prop({ required: true, min: 0, max: 100 })
  proficiency: number;

  @ApiProperty({ enum: ['teaching', 'learning'] })
  @Prop({ required: true, enum: ['teaching', 'learning'] })
  type: string;

  @ApiProperty({ required: false })
  @Prop()
  description?: string;

  @ApiProperty({ required: false })
  @Prop()
  experience?: string;

  @ApiProperty({ required: false })
  @Prop()
  goals?: string;

  @ApiProperty({ required: false, type: [String] })
  @Prop({ type: [String] })
  agenda?: string[];

  @ApiProperty({ required: false, type: [String], description: 'Metadata keywords for skill categorization and search' })
  @Prop({ type: [String], default: [] })
  metadata?: string[];

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);