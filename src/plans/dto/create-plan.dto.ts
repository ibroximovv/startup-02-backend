import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreatePlanDto {
    @ApiProperty({ example: 'IELTS-7.5 sertificate' })
    @IsString()
    title: string

    @ApiProperty({ example: 'To get a high score in IELTS exam', required: false })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({ example: '60 days', required: false })
    @IsDateString()
    targetDate: string
}
