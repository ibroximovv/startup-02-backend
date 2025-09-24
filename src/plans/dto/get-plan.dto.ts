import { ApiProperty } from "@nestjs/swagger";
import { PlanStatus } from "@prisma/client";
import { IsEnum, IsIn, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilterDto } from "src/direction/filter.dto";

export class GetPlanDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'title', 'targetDate', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'title', 'targetDate', 'createdAt'])
    sortBy?: 'id' | 'title' | 'targetDate' | 'createdAt'

    @ApiProperty({ enum: PlanStatus, required: false })
    @IsOptional()
    @IsEnum(PlanStatus)
    status?: PlanStatus

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    usersId?: UUID
}