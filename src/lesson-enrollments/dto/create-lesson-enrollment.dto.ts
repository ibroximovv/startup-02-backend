import { ApiProperty } from "@nestjs/swagger";
import { LessonEnrollmentStatus } from "@prisma/client";
import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateLessonEnrollmentDto {
    @ApiProperty({ example: 'lessonId123' })
    @IsUUID()
    lessonId: UUID;
}
