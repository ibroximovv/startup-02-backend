import { PartialType } from '@nestjs/swagger';
import { CreateLessonRatingDto } from './create-lesson-rating.dto';

export class UpdateLessonRatingDto extends PartialType(CreateLessonRatingDto) {}
