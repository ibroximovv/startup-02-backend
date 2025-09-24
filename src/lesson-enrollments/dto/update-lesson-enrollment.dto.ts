import { PartialType } from '@nestjs/swagger';
import { CreateLessonEnrollmentDto } from './create-lesson-enrollment.dto';

export class UpdateLessonEnrollmentDto extends PartialType(CreateLessonEnrollmentDto) {}
