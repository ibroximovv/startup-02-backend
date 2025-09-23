import { ApiProperty } from "@nestjs/swagger";
import { DirectionLevel } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilterDto } from "src/direction/filter.dto";

export class GetAuthDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'firstName', 'lastName', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'firstName', 'lastName', 'createdAt'])
    sortBy?: 'id' | 'firstName' | 'lastName' | 'createdAt'

    @ApiProperty({ enum: DirectionLevel, required: false })
    @IsOptional()
    @IsEnum(DirectionLevel)
    directionLevel?: DirectionLevel

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    directionId?: UUID
}