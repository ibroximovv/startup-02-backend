import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { FilterDto } from "../filter.dto";

export class GetDirectionDto extends FilterDto {
    @ApiProperty({ required: false, enum: ['id', 'directionName', 'createdAt'] })
    @IsOptional()
    @IsIn(['id', 'directionName', 'createdAt'])
    sortBy?: 'id' | 'directionName' | 'createdAt' 
}