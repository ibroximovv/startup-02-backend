import { Module } from '@nestjs/common';
import { LessonEnrollmentsService } from './lesson-enrollments.service';
import { LessonEnrollmentsController } from './lesson-enrollments.controller';

@Module({
  controllers: [LessonEnrollmentsController],
  providers: [LessonEnrollmentsService],
})
export class LessonEnrollmentsModule {}
