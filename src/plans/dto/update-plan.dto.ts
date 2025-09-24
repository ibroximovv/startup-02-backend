import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';
import { PlanStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
    @ApiProperty({ enum: PlanStatus, example: PlanStatus.IN_PROGRESS, required: false })
    @IsOptional()
    @IsEnum(PlanStatus)
    status?: PlanStatus;
}
