import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsUUID } from "class-validator";
import { FriendStatus } from "@prisma/client"; // yoki enums faylingizdan import qiling

export class CreateFriendDto {
    @ApiProperty({ example: "9f8c2f8e-47bb-4f8d-9c6f-12c45d8f8a92" })
    @IsUUID()
    friendId: string;

    @ApiProperty({ enum: FriendStatus, example: FriendStatus.PENDING })
    @IsEnum(FriendStatus)
    status: FriendStatus;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    offer?: boolean = true;
}
