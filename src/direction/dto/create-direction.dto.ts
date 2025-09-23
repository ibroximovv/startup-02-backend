import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateDirectionDto {
    @ApiProperty({ example: 'Dasturlash-backend' })
    @IsString()
    directionName: string
}
