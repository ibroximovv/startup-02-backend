import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetGroupMemberDto } from './dto/get-grpup-member.dto';

@Injectable()
export class GroupMembersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createGroupMemberDto: CreateGroupMemberDto, req: Request) {
    let { usersId, groupsId } = createGroupMemberDto;
    try {
      const findgroup = await this.prisma.groups.findFirst({ where: { id: groupsId } });
      if (!findgroup) throw new BadRequestException('Group not found!');
      if (!usersId) {
        usersId = req['user']?.id;
        if (!usersId) throw new BadRequestException('User id not found in request!');
      }
      const findone = await this.prisma.users.findFirst({ where: { id: usersId } });
      if (!findone) throw new BadRequestException('User not found!');
      const checkexist = await this.prisma.groupMembers.findFirst({ where: { usersId, groupsId } });
      if (checkexist) throw new BadRequestException('User already in group!');
      return await this.prisma.groupMembers.create({ data: { usersId, groupsId } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internals server error!');
    }
  }

  async findAll(query: GetGroupMemberDto) {
    const { page = 1, pageSize = 10, role, search, sortBy, sortOrder = 'asc' } = query
    try {
      let where: any = {};

      if (search) {
        where.OR = [
          { users: { username: { contains: search, mode: 'insensitive' } } },
        ]
      }

      if (role) where.role = role;

      const pageNum = Math.max(Number(page), 1);
      const pageSizeNum = Math.max(Number(pageSize), 1);

      const skip = (pageNum - 1) * pageSizeNum;
      const take = pageSizeNum;

      const [data, total] = await Promise.all([
        this.prisma.groupMembers.findMany({
          where,
          skip,
          take,
          include: { users: true, group: true },
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.groupMembers.count({ where }),
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
      throw new InternalServerErrorException(error.message || 'Internals server error!')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.groupMembers.findFirst({ where: { id } });
      if (!findone) throw new BadRequestException('Group member not found!');
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internals server error!')
    }
  }

  async update(id: string, updateGroupMemberDto: UpdateGroupMemberDto) {
    try {
      await this.findOne(id);
      return await this.prisma.groupMembers.update({ where: { id }, data: updateGroupMemberDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internals server error!')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.groupMembers.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internals server error!')
    }
  }
}
