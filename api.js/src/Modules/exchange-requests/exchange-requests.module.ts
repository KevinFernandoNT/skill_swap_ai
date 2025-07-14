import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRequest, ExchangeRequestSchema } from './exchange-request.schema';
import { ExchangeRequestsController } from './exchange-requests.controller';
import { ExchangeRequestsService } from './exchange-requests.service';
import { ExchangeRequestsRepository } from './exchange-requests.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExchangeRequest.name, schema: ExchangeRequestSchema }]),
  ],
  controllers: [ExchangeRequestsController],
  providers: [ExchangeRequestsService, ExchangeRequestsRepository],
  exports: [ExchangeRequestsService, ExchangeRequestsRepository],
})
export class ExchangeRequestsModule {} 