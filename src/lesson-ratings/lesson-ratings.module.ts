import { Module } from '@nestjs/common';
import { LessonRatingsService } from './lesson-ratings.service';
import { LessonRatingsController } from './lesson-ratings.controller';

@Module({
  controllers: [LessonRatingsController],
  providers: [LessonRatingsService],
})
export class LessonRatingsModule {}
