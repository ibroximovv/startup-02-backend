import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { UpdateGroupMessageDto } from './dto/update-group-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupMessageService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createGroupMessageDto: CreateGroupMessageDto) {
    const { groupsId, senderId } = createGroupMessageDto
    try {
      const group = await this.prisma.groups.findFirst({ where: { id: groupsId } });
      if (!group) throw new BadRequestException('Group not found!');
      const user = await this.prisma.users.findFirst({ where: { id: senderId } });
      if (!user) throw new BadRequestException('User not found!');
      return 'This action adds a new groupMessage';
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findAll() {
    try {
      return await this.prisma.groupMessages.findMany();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.groupMessages.findFirst({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findGroupWithGroupName(groupName: string) {
    try {
      const group = await this.prisma.groups.findMany({ where: { name: groupName } });
      if (!group) throw new BadRequestException('Group not found!');
      return group;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async update(id: string, updateGroupMessageDto: UpdateGroupMessageDto) {
    try {
      const existingMessage = await this.prisma.groupMessages.findFirst({ where: { id } });
      if (!existingMessage) throw new BadRequestException('Group message not found!');
      return await this.prisma.groupMessages.update({ where: { id }, data: { message: updateGroupMessageDto.message } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.groupMessages.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async removeAutomatic(groupsId: string) {
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const deleted = await this.prisma.groupMessages.deleteMany({
        where: {
          groupsId,
          createdAt: { lt: threeDaysAgo }
        }
      });
      if (deleted.count === 0) throw new BadRequestException('No old messages found for this group!');
      return deleted;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }
}