import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeSessionsController } from './exchange-sessions.controller';
import { ExchangeSessionsService } from './exchange-sessions.service';
import { ExchangeSessionsRepository } from './exchange-sessions.repository';
import { ExchangeSession, ExchangeSessionSchema } from './schemas/exchange-session.schema';
import { Skill, SkillSchema } from '../skills/schemas/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExchangeSession.name, schema: ExchangeSessionSchema },
      { name: Skill.name, schema: SkillSchema }
    ]),
  ],
  controllers: [ExchangeSessionsController],
  providers: [
    ExchangeSessionsService,
    ExchangeSessionsRepository,
  ],
  exports: [ExchangeSessionsService, ExchangeSessionsRepository],
})
export class ExchangeSessionsModule {} 