import { ApiProperty } from "@nestjs/swagger";
import { GroupMemebersRole } from "@prisma/client";
import { IsEnum, IsIn, IsOptional } from "class-validator";
import { FilterDto } from "src/direction/filter.dto";

export class GetGroupMemberDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'createdAt'])
    sortBy?: 'id' | 'createdAt'

    @ApiProperty({ enum: GroupMemebersRole, required: false })
    @IsOptional()
    @IsEnum(GroupMemebersRole)
    role?: GroupMemebersRole
}