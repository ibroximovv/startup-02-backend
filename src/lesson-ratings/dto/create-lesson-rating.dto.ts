import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID, Max, Min } from "class-validator";
import { UUID } from "crypto";

export class CreateLessonRatingDto {
    @ApiProperty({ example: 'lessonEnrollmentId' })
    @IsUUID()
    lessonEnrollmentId: UUID;

    @ApiProperty({ example: 4 })
    @IsNumber()
    @Min(1)
    @Max(10)
    rating: number

    @ApiProperty({ example: 'Great lesson!' })
    @IsString()
    comment: string;
}
