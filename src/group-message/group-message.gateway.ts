import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GroupMessageService } from './group-message.service';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { UpdateGroupMessageDto } from './dto/update-group-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GroupMessageGateway {
  constructor(private readonly groupMessageService: GroupMessageService) { }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinGroup')
  joinGroup(@MessageBody() data: { groupsId: string }, @ConnectedSocket() client: Socket) {
    this.groupMessageService.findGroupWithGroupName(data.groupsId).then(() => {
      client.join(data.groupsId)
    })
  }

  @SubscribeMessage('to-group')
  toGroup(@MessageBody() data: { groupsId: string, message: string, senderId: string }, @ConnectedSocket() client: Socket) {
    this.groupMessageService.create({ groupsId: data.groupsId, message: data.message, senderId: data.senderId })
    this.server.to(data.groupsId).emit('new', data)
  }

  @SubscribeMessage('findAllGroupMessage')
  findAll() {
    this.groupMessageService.findAll().then((res) => {
      this.server.emit('all', res)
    });
  }

  @SubscribeMessage('findOneGroupMessage')
  findOne(@MessageBody() id: string) {
    this.groupMessageService.findOne(id).then((res) => {
      this.server.emit('one', res)
    });
  }

  @SubscribeMessage('updateGroupMessage')
  update(@MessageBody() updateGroupMessageDto: UpdateGroupMessageDto) {
    this.groupMessageService.update(updateGroupMessageDto?.id, updateGroupMessageDto).then((res) => {
      this.server.emit('updated', res)
    });
  }

  @SubscribeMessage('removeGroupMessage')
  remove(@MessageBody() id: string) {
    this.groupMessageService.remove(id).then((res) => {
      this.server.emit('removed', res)
    });
  }

  @SubscribeMessage('removeAutomaticGroupMessage')
  removeAutomatic(@MessageBody() groupsId: string) {
    this.groupMessageService.removeAutomatic(groupsId).then((res) => {
      this.server.emit('removedAutomatic', res)
    })
  }
}
