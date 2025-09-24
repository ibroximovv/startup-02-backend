import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFriendMessageDto } from './dto/create-friend-message.dto';
import { UpdateFriendMessageDto } from './dto/update-friend-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendMessageService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createFriendMessageDto: CreateFriendMessageDto) {
    const { friendId, senderId } = createFriendMessageDto
    try {
      const friend = await this.prisma.friends.findFirst({ where: { id: friendId } });
      if (!friend) throw new BadRequestException('Friend not found!');
      const user = await this.prisma.users.findFirst({ where: { id: senderId } });
      if (!user) throw new BadRequestException('User not found!');
      if (friend.status !== 'ACCEPTED') throw new BadRequestException('Friendship not confirmed or you are blocked!')
      return await this.prisma.friendMessage.create({ data: createFriendMessageDto })
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findAll() {
    try {
      return await this.prisma.friendMessage.findMany();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.friendMessage.findFirst({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async update(id: string, updateFriendMessageDto: UpdateFriendMessageDto) {
    try {
      await this.findOne(id);
      return await this.prisma.friendMessage.update({ where: { id }, data: updateFriendMessageDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.friendMessage.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async removeAutomatic(friendId: string) {
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const deleted = await this.prisma.friendMessage.deleteMany({
        where: {
          friendId: friendId,
          createdAt: { lt: threeDaysAgo }
        }
      });
      if (deleted.count === 0) throw new BadRequestException('No old messages found for this friend!');
      return deleted;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }
}
