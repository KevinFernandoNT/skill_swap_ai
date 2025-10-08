import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { ExchangeSession, ExchangeSessionSchema } from '../exchange-sessions/schemas/exchange-session.schema';
import { ExchangeRequest, ExchangeRequestSchema } from '../exchange-requests/exchange-request.schema';
import { Skill, SkillSchema } from '../skills/schemas/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ExchangeSession.name, schema: ExchangeSessionSchema },
      { name: ExchangeRequest.name, schema: ExchangeRequestSchema },
      { name: Skill.name, schema: SkillSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
