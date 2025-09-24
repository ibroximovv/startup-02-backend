import { ApiProperty } from "@nestjs/swagger";
import { LessonMode } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilterDto } from "src/direction/filter.dto";

export class GetLessonDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'title', 'location', 'date', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'title', 'location', 'date', 'createdAt'])
    sortBy?: 'id' | 'title' | 'location' | 'date' | 'createdAt'

    @ApiProperty({ enum: LessonMode, required: false })
    @IsOptional()
    @IsEnum(LessonMode)
    mode?: LessonMode

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    teacherId?: UUID
}