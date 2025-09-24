import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { LessonRatingsService } from './lesson-ratings.service';
import { CreateLessonRatingDto } from './dto/create-lesson-rating.dto';
import { UpdateLessonRatingDto } from './dto/update-lesson-rating.dto';
import { Request } from 'express';
import { GetLessonRatingDto } from './dto/get-lesson-rating.dto';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('lesson-ratings')
export class LessonRatingsController {
  constructor(private readonly lessonRatingsService: LessonRatingsService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createLessonRatingDto: CreateLessonRatingDto, @Req() req: Request) {
    return this.lessonRatingsService.create(createLessonRatingDto, req);
  }

  @Get()
  findAll(@Query() query: GetLessonRatingDto) {
    return this.lessonRatingsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonRatingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonRatingDto: UpdateLessonRatingDto) {
    return this.lessonRatingsService.update(id, updateLessonRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonRatingsService.remove(id);
  }
}
