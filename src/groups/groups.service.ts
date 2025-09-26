import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetGroupDto } from './dto/get-group.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createGroupDto: CreateGroupDto, req: Request) {
    try {
      const findone = await this.prisma.groups.findFirst({ where: { name: createGroupDto.name } })
      if (findone) throw new BadRequestException('Group name already exists!');
      const finduser = await this.prisma.users.findFirst({ where: { id: req['user'].id } })
      if (!finduser) throw new BadRequestException('User not found!');
      return await this.prisma.groups.create({ data: { ...createGroupDto, ownerId: finduser.id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async findAll(query: GetGroupDto) {
    const { page = 1, pageSize = 10, search, sortBy, sortOrder = 'asc' } = query
    try {
      let where: any = {}

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
        ]
      }
      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.groups.findMany({
          where,
          skip,
          take,
          include: { owner: true, GroupMembers: true },
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.groups.count({ where })
      ]);

      const totalPages = Math.ceil(total / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.groups.findFirst({ where: { id } });
      if (!findone) throw new BadRequestException('Group not found!');
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      await this.findOne(id);
      return await this.prisma.groups.update({ where: { id }, data: updateGroupDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.groups.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }
}
