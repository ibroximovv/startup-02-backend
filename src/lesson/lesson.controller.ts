import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Request } from 'express';
import { GetLessonDto } from './dto/get-lesson.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @Req() req: Request) {
    return this.lessonService.create(createLessonDto, req);
  }

  @Get()
  findAll(@Query() query: GetLessonDto) {
    return this.lessonService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(id);
  }
}
