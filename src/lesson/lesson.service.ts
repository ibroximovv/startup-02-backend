import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetLessonDto } from './dto/get-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createLessonDto: CreateLessonDto, req: Request) {
    try {
      const finduser = await this.prisma.users.findFirst({ where: { id: req['user'].id } });
      if (!finduser) throw new BadRequestException('User not found!');
      if (finduser.role !== 'TEACHER') throw new BadRequestException('You are not a teacher!');
      if (createLessonDto.date && new Date(createLessonDto.date) < new Date()) {
        throw new BadRequestException('Lesson date cannot be in the past!');
      }
      return await this.prisma.lesson.create({ data: { ...createLessonDto, teacherId: finduser.id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async findAll(query: GetLessonDto) {
    const { page = 1, pageSize = 10, mode, search, sortBy, sortOrder = 'asc', teacherId } = query;
    try {
      let where: any = {};
      if (mode) where.mode = mode;
      if (teacherId) where.teacherId = teacherId;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },]
      }

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.lesson.findMany({
          where,
          skip,
          take,
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.lesson.count({ where })
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
      const findone = await this.prisma.lesson.findFirst({ where: { id } });
      if (!findone) throw new BadRequestException('Lesson not found!');
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    try {
      await this.findOne(id);
      if (updateLessonDto.date && new Date(updateLessonDto.date) < new Date()) {
        throw new BadRequestException('Lesson date cannot be in the past!');
      }
      return await this.prisma.lesson.update({ where: { id }, data: updateLessonDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.lesson.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }
}
