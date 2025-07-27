import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillsRepository } from './skills.repository';
import { Skill, SkillSchema } from './schemas/skill.schema';
import { SkillsHttpService } from './skills-http.service';
import { PythonApiService } from '../common/python-api.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SkillsController],
  providers: [SkillsService, SkillsRepository, SkillsHttpService, PythonApiService],
  exports: [SkillsService, SkillsRepository],
})
export class SkillsModule {}