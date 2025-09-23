import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetFriendDto } from './dto/get-friend.dto';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createFriendDto: CreateFriendDto, req: Request) {
    try {
      const findone = await this.prisma.friends.findFirst({ where: { friendId: createFriendDto.friendId } })
      if (findone) throw new BadRequestException('Friend already exists')
      const user = await this.prisma.users.findFirst({ where: { id: req['user'].id } })
      if (!user) throw new BadRequestException('User not found!')
      const friend = await this.prisma.users.findFirst({ where: { id: createFriendDto.friendId } })
      if (!friend) throw new BadRequestException('Friend not found')
      return await this.prisma.friends.create({
        data: {
          ...createFriendDto,
          usersId: req['user'].id
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findAll(query: GetFriendDto) {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'asc',
      sortBy,
      friendId,
      status,
      offer,
    } = query;

    try {
      const where: any = {};

      if (friendId) {
        where.friendId = friendId;
      }

      if (status) {
        where.status = status;
      }
      
      // offer...

      const pageNum = Math.max(Number(page), 1);
      const pageSizeNum = Math.max(Number(pageSize), 1);

      const skip = (pageNum - 1) * pageSizeNum;
      const take = pageSizeNum;

      const [data, total] = await Promise.all([
        this.prisma.friends.findMany({
          where,
          skip,
          take,
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.friends.count({ where }),
      ]);

      const totalPages = Math.ceil(total / pageSizeNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return {
        data,
        meta: {
          total,
          page: pageNum,
          pageSize: pageSizeNum,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        error.message || 'Internal server error!',
      );
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.friends.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Friend not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async update(id: string, updateFriendDto: UpdateFriendDto) {
    try {
      await this.findOne(id)
      return await this.prisma.friends.update({ where: { id }, data: { status: updateFriendDto.status } })
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.prisma.friends.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }
}
