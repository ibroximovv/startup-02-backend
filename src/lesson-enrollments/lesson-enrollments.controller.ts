import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { LessonEnrollmentsService } from './lesson-enrollments.service';
import { CreateLessonEnrollmentDto } from './dto/create-lesson-enrollment.dto';
import { UpdateLessonEnrollmentDto } from './dto/update-lesson-enrollment.dto';
import { Request } from 'express';
import { GetLessonEnrollmentDto } from './dto/get-lesson-enrollment.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('lesson-enrollments')
export class LessonEnrollmentsController {
  constructor(private readonly lessonEnrollmentsService: LessonEnrollmentsService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createLessonEnrollmentDto: CreateLessonEnrollmentDto, @Req() req: Request) {
    return this.lessonEnrollmentsService.create(createLessonEnrollmentDto, req);
  }

  @Get()
  findAll(@Query() query: GetLessonEnrollmentDto) {
    return this.lessonEnrollmentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonEnrollmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonEnrollmentDto: UpdateLessonEnrollmentDto) {
    return this.lessonEnrollmentsService.update(id, updateLessonEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonEnrollmentsService.remove(id);
  }
}
