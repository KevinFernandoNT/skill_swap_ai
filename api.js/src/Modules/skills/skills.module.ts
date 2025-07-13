import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillsRepository } from './skills.repository';
import { Skill, SkillSchema } from './schemas/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
  ],
  controllers: [SkillsController],
  providers: [SkillsService, SkillsRepository],
  exports: [SkillsService, SkillsRepository],
})
export class SkillsModule {}