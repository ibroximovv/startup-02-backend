import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetDirectionDto } from './dto/get-direction.dto';

@Injectable()
export class DirectionService {
  constructor(private readonly prisma: PrismaService){}
  async create(createDirectionDto: CreateDirectionDto) {
    try {
      const direction = await this.prisma.direction.findFirst({ where: { directionName: createDirectionDto.directionName }})
      if (direction) throw new BadRequestException('Direction already exists')
      return await this.prisma.direction.create({ data: createDirectionDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(getDirectionDto: GetDirectionDto) {
    const { search, page = 1, pageSize = 10, sortBy = 'directionName', sortOrder = 'asc' } = getDirectionDto
    try {
      const where: any = {};
      
      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.direction.findMany({
          where,
          skip,
          take,
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined
        }),
        this.prisma.direction.count({ where })
      ]);

      const totalPages = Math.ceil(total / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return { data, 
        meta: {
          total,
          page,
          pageSize,
          hasPrevPage,
          hasNextPage,
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const direction = await this.prisma.direction.findFirst({ where: { id }})
      if (!direction) throw new BadRequestException('Direction not found!')
      return direction;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateDirectionDto: UpdateDirectionDto) {
    try {
      await this.findOne(id)
      return await this.prisma.direction.update({ where: { id }, data: updateDirectionDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.prisma.direction.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
