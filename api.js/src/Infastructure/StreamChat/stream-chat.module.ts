import { Module } from '@nestjs/common';
import { StreamChatService } from './stream-chat.service';

@Module({
  providers: [StreamChatService],
  exports: [StreamChatService],
})
export class StreamChatModule {} 