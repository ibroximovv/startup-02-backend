import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLessonEnrollmentDto } from './dto/create-lesson-enrollment.dto';
import { UpdateLessonEnrollmentDto } from './dto/update-lesson-enrollment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { GetLessonEnrollmentDto } from './dto/get-lesson-enrollment.dto';

@Injectable()
export class LessonEnrollmentsService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createLessonEnrollmentDto: CreateLessonEnrollmentDto, req: Request) {
    try {
      const findlesson = await this.prisma.lesson.findFirst({ where: { id: createLessonEnrollmentDto.lessonId } });
      if (!findlesson) throw new BadRequestException('Lesson not found!');
      const finduser = await this.prisma.users.findFirst({ where: { id: req['user'].id } });
      if (!finduser) throw new BadRequestException('Student not found!');
      return await this.prisma.lessonEnrollments.create({ data: { ...createLessonEnrollmentDto, studentId: finduser.id } })
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async findAll(query: GetLessonEnrollmentDto) {
    const { page = 1, pageSize = 10, lessonId, sortBy, sortOrder = 'asc', status } = query
    try {
      let where: any = {};
      if (lessonId) where.lessonId = lessonId;
      if (status) where.status = status;

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.lessonEnrollments.findMany({
          where,
          skip,
          take,
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        }),
        this.prisma.lessonEnrollments.count({ where })
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
      const findone = await this.prisma.lessonEnrollments.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Lesson enrollment not found!');
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async update(id: string, updateLessonEnrollmentDto: UpdateLessonEnrollmentDto) {
    try {
      await this.findOne(id);
      return await this.prisma.lessonEnrollments.update({ where: { id }, data: updateLessonEnrollmentDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.lessonEnrollments.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error!');
    }
  }
}
