import { ApiProperty } from "@nestjs/swagger";
import { LessonMode } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
    @ApiProperty({ example: 'Suniy intelekt' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Suniy intelekt haqida' })
    @IsString()
    description: string;

    @ApiProperty({ example: '12 september 2023' })
    @IsDateString()
    date: string;

    @ApiProperty({ enum: LessonMode, example: LessonMode.OFFLINE })
    @IsEnum(LessonMode)
    mode: LessonMode;

    @ApiProperty({ example: 'https://zoom.us/j/1234567890', required: false })
    @IsOptional()
    @IsString()
    meetingUrl?: string;

    @ApiProperty({ example: 'Room 101', required: false })
    @IsOptional()
    @IsString()
    location?: string;
}
