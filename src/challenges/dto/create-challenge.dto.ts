import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateChallengeDto {
    @ApiProperty({ example: 'Sport' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Jismoniy holatni yaxshilash', required: false })
    @IsOptional()
    @IsString()
    goal?: string;

    @ApiProperty({ example: '2025-09-19T10:00:00.000Z' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2025-10-19T10:00:00.000Z' })
    @IsDateString()
    endDate: string;  
}
