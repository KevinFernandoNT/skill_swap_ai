import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import configuration from './config/configuration';
import { AuthModule } from './Modules/auth/auth.module';
import { SkillsModule } from './Modules/skills/skills.module';
import { SessionsModule } from './Modules/sessions/sessions.module';
import { MessagesModule } from './Modules/messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamChatModule } from './Infastructure/StreamChat/stream-chat.module';
import { ExchangeRequestsModule } from './Modules/exchange-requests/exchange-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath:'.env.development',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
      }),
    }),
    UserModule,
    AuthModule,
    SkillsModule,
    SessionsModule,
    MessagesModule,
    StreamChatModule,
    ExchangeRequestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
