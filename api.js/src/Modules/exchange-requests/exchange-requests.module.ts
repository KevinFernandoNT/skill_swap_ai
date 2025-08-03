import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRequestsController } from './exchange-requests.controller';
import { ExchangeRequestsService } from './exchange-requests.service';
import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { ExchangeRequest, ExchangeRequestSchema } from './exchange-request.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExchangeRequest.name, schema: ExchangeRequestSchema }
    ]),
    NotificationsModule
  ],
  controllers: [ExchangeRequestsController],
  providers: [ExchangeRequestsService, ExchangeRequestsRepository],
  exports: [ExchangeRequestsService]
})
export class ExchangeRequestsModule {} 