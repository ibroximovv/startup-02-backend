import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { FilterDto } from "src/direction/filter.dto";

export class GetChallengeDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'title', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'title', 'createdAt'])
    sortBy?: 'id' | 'title' | 'createdAt'
}