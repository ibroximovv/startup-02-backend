import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { FilterDto } from "src/direction/filter.dto";

export class GetGroupDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'name', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'name', 'createdAt'])
    sortBy?: 'id' | 'name' | 'createdAt'
}