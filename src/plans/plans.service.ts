import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetPlanDto } from './dto/get-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createPlanDto: CreatePlanDto, req: Request) {
    try {
      const finduser = await this.prisma.users.findFirst({ where: { id: req['user'].id } });
      if (!finduser) throw new BadRequestException('User not found');
      const findone = await this.prisma.plans.findFirst({ where: { title: createPlanDto.title, usersId: finduser.id } })
      if (findone) throw new BadRequestException('Plan with this title already exists');
      return await this.prisma.plans.create({ data: { ...createPlanDto, usersId: finduser.id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal Server Error!');
    }
  }

  async findAll(query: GetPlanDto) {
    const { page = 1, pageSize = 10, search, sortBy, sortOrder = 'asc', status, usersId } = query
    try {
      let where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }

      if (usersId) {
        where.usersId = usersId
      }

      if (status) {
        where.status = status
      }

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.plans.findMany({
          where,
          skip,
          take,
          include: { users: true },
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.plans.count({ where })
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
      throw new InternalServerErrorException(error.message || 'Internal Server Error!');
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.plans.findFirst({ where: { id } });
      if (!findone) throw new BadRequestException('Plan not found');
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal Server Error!');
    }
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    try {
      const findone = await this.findOne(id);
      if (updatePlanDto.title && updatePlanDto.title === findone.title) throw new BadRequestException('Plan with this title already exists');
      return await this.prisma.plans.update({ where: { id }, data: updatePlanDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal Server Error!');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.plans.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal Server Error!');
    }
  }
}
