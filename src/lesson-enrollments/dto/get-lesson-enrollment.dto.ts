import { ApiProperty } from "@nestjs/swagger";
import { LessonEnrollmentStatus } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilterDto } from "src/direction/filter.dto";

export class GetLessonEnrollmentDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'createdAt'])
    sortBy?: 'id' | 'createdAt'

    @ApiProperty({ enum: LessonEnrollmentStatus, required: false })
    @IsOptional()
    @IsEnum(LessonEnrollmentStatus)
    status?: LessonEnrollmentStatus

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    lessonId?: UUID
}