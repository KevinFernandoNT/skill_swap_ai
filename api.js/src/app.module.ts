import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SkillsModule } from './Modules/skills/skills.module';
import { SessionsModule } from './Modules/sessions/sessions.module';
import { ExchangeRequestsModule } from './Modules/exchange-requests/exchange-requests.module';
import { NotificationsModule } from './Modules/notifications/notifications.module';
import { MessagesModule } from './Modules/messages/messages.module';
import { StreamChatModule } from './Infastructure/StreamChat/stream-chat.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath:'.env.development',
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
      }),
    }),
    AuthModule,
    UserModule,
    SkillsModule,
    SessionsModule,
    MessagesModule,
    StreamChatModule,
    ExchangeRequestsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
