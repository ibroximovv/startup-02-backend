import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilterDto } from "src/direction/filter.dto";

export class GetLessonRatingDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'rating', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'rating', 'createdAt'])
    sortBy?: 'id' | 'rating' | 'createdAt'

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    studentId?: UUID
}