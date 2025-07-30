import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { Session, SessionSchema } from './schemas/session.schema';
import { Skill, SkillSchema } from '../skills/schemas/skill.schema';
import { ExternalHttpService } from '../common/http.service';
import { PythonApiService } from '../common/python-api.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Skill.name, schema: SkillSchema }
    ]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    SessionsRepository,
    ExternalHttpService,
    PythonApiService,
  ],
  exports: [SessionsService, SessionsRepository, ExternalHttpService],
})
export class SessionsModule {}