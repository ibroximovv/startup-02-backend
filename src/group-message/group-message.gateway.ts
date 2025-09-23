import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GroupMessageService } from './group-message.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { UpdateGroupMessageDto } from './dto/update-group-message.dto';

@WebSocketGateway()
export class GroupMessageGateway {
  constructor(private readonly groupMessageService: GroupMessageService) {}

  @SubscribeMessage('createGroupMessage')
  create(@MessageBody() createGroupMessageDto: CreateGroupMessageDto) {
    return this.groupMessageService.create(createGroupMessageDto);
  }

  @SubscribeMessage('findAllGroupMessage')
  findAll() {
    return this.groupMessageService.findAll();
  }

  @SubscribeMessage('findOneGroupMessage')
  findOne(@MessageBody() id: string) {
    return this.groupMessageService.findOne(id);
  }

  @SubscribeMessage('updateGroupMessage')
  update(@MessageBody() updateGroupMessageDto: UpdateGroupMessageDto) {
    return this.groupMessageService.update(updateGroupMessageDto?id, updateGroupMessageDto);
  }

  @SubscribeMessage('removeGroupMessage')
  remove(@MessageBody() id: string) {
    return this.groupMessageService.remove(id);
  }
}
