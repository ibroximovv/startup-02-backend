import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendMessageDto } from './create-friend-message.dto';

export class UpdateFriendMessageDto extends PartialType(CreateFriendMessageDto) {
  id: string;
}
