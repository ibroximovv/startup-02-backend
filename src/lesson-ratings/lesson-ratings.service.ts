import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLessonRatingDto } from './dto/create-lesson-rating.dto';
import { UpdateLessonRatingDto } from './dto/update-lesson-rating.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetLessonRatingDto } from './dto/get-lesson-rating.dto';

@Injectable()
export class LessonRatingsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createLessonRatingDto: CreateLessonRatingDto, req: Request) {
    try {
      const findone = await this.prisma.lessonEnrollments.findFirst({ where: { studentId: req['user'].id } })
      if (!findone) throw new BadRequestException('You are not enrolled in this lesson!');
      if (findone.status !== 'COMPLETED') throw new BadRequestException('You can only rate a lesson after completing it!');
      return await this.prisma.lessonRatings.create({
        data: {
          rating: createLessonRatingDto.rating,
          comment: createLessonRatingDto.comment,
          lesson: {
            connect: { id: createLessonRatingDto.lessonEnrollmentId },
          },
          student: {
            connect: { id: req['user'].id },
          },
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async findAll(query: GetLessonRatingDto) {
    const { page = 1, pageSize = 10, sortBy, search, sortOrder = 'asc', studentId } = query;
    try {
      let where: any = {}
      if (search) {
        where.OR = [
          { comment: { contains: search, mode: 'insensitive' } },
        ]
      }
      if (studentId) where.studentId = studentId;

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.lessonRatings.findMany({
          where,
          skip,
          take,
          include: { lesson: true, student: true },
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.lessonRatings.count({ where })
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
      const findone = await this.prisma.lessonRatings.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Lesson rating not found!');
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async update(id: string, updateLessonRatingDto: UpdateLessonRatingDto) {
    try {
      await this.findOne(id);
      return await this.prisma.lessonRatings.update({ where: { id }, data: { ...updateLessonRatingDto } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.lessonRatings.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }
}
