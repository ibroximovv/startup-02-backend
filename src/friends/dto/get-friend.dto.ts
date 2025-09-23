import { ApiProperty } from "@nestjs/swagger";
import { FriendStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilterDto } from "src/direction/filter.dto";

export class GetFriendDto extends FilterDto {
    @ApiProperty({ enum: ['id', 'createdAt'], required: false })
    @IsOptional()
    @IsIn(['id', 'createdAt'])
    sortBy?: 'id' | 'createdAt'

    @ApiProperty({ enum: FriendStatus, required: false })
    @IsOptional()
    @IsEnum(FriendStatus)
    status?: FriendStatus

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    friendId?: UUID

    @ApiProperty({ required: false, type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    offer?: boolean;
}