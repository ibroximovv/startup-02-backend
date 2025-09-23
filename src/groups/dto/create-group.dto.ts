import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
    @ApiProperty({ example: 'Group Name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'This is a sample group description.', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
