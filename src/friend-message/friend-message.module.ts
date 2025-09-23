import { Module } from '@nestjs/common';
import { FriendMessageService } from './friend-message.service';
import { FriendMessageGateway } from './friend-message.gateway';

@Module({
  providers: [FriendMessageGateway, FriendMessageService],
})
export class FriendMessageModule {}
