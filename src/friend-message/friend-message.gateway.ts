import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { FriendMessageService } from './friend-message.service';
import { CreateFriendMessageDto } from './dto/create-friend-message.dto';
import { UpdateFriendMessageDto } from './dto/update-friend-message.dto';
import { Socket, Server } from "socket.io";
import { ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway()
export class FriendMessageGateway {
  constructor(private readonly friendMessageService: FriendMessageService) { }

  @WebSocketServer()
  server: Server;
  private friends = new Map();

  handleDisconnect(client: Socket) {
    let friendId: string | undefined;
    for (const [key, value] of this.friends.entries()) {
      if (value === client.id) {
        friendId = key;
        break;
      }
    }
    if (friendId) {
      this.friends.delete(friendId);
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('registerFriendMessage')
  handleRegister(@MessageBody() data: { friendId: string }, @ConnectedSocket() client: Socket) {
    const friendId = data.friendId;
    const socketId = client.id;
    this.friends.set(friendId, socketId);
    console.log(this.friends);
  }

  @SubscribeMessage('privateFriendMessage')
  privateChat(@MessageBody() data: CreateFriendMessageDto, @ConnectedSocket() client: Socket) {
    const friendId = data.friendId;
    const socketId = this.friends.get(friendId)
    this.friendMessageService.create(data)
    console.log(this.friends);
    this.server.to(socketId).emit('new', data);
  }

  @SubscribeMessage('findAllFriendMessage')
  findAll() {
    this.friendMessageService.findAll().then((res) => {
      this.server.emit('findAllFriendMessage', res)
    });
  }

  @SubscribeMessage('findOneFriendMessage')
  findOne(@MessageBody() id: string) {
    this.friendMessageService.findOne(id).then((res) => {
      this.server.emit('findOneFriendMessage', res)
    });
  }

  @SubscribeMessage('updateFriendMessage')
  update(@MessageBody() updateFriendMessageDto: UpdateFriendMessageDto) {
    this.friendMessageService.update(updateFriendMessageDto.id, updateFriendMessageDto).then((res) => {
      this.server.emit('updateFriendMessage', res)
    });
  }

  @SubscribeMessage('removeFriendMessage')
  remove(@MessageBody() id: string) {
    this.friendMessageService.remove(id).then((res) => {
      this.server.emit('removeFriendMessage', res)
    });
  }
}
