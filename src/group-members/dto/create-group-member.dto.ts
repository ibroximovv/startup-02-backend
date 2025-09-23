import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateGroupMemberDto {
    @ApiProperty({ example: "groupsId" })
    @IsUUID()
    groupsId: UUID

    @ApiProperty({ example: "userId", required: false })
    @IsOptional()
    @IsUUID()
    usersId?: string 
}
