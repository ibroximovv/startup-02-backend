import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetChallengeDto } from './dto/get-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createChallengeDto: CreateChallengeDto, req: Request) {
    try {
      const findUser = await this.prisma.users.findFirst({ where: { id: req['user'].id }})
      if (!findUser) throw new BadRequestException('Owner not found!')
      const findone = await this.prisma.challenges.findFirst({
        where: {
          AND: [
            { title: createChallengeDto.title },
            { goal: createChallengeDto.goal },
            { startDate: createChallengeDto.startDate },
            { endDate: createChallengeDto.endDate },
          ]
        }
      })
      if (findone) throw new BadRequestException('Challenge already eixts')
      return await this.prisma.challenges.create({
        data: {
          ...createChallengeDto,
          ownerId: req['user'].id
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findAll(query: GetChallengeDto) {
    const { page = 1, pageSize = 10, search, sortOrder = 'asc', sortBy } = query;
    try {
      const where: any = {}

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
        ]
      }

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.challenges.findMany({
          where,
          skip,
          take,
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.challenges.count({ where })
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
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.challenges.findFirst({ where: { id }});
      if (!findone) throw new BadRequestException('Challenge not found!')
      return findone
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    try {
      await this.findOne(id)
      return await this.prisma.challenges.update({ where: { id }, data: updateChallengeDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.prisma.challenges.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }
}
