import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendOtpDto {
    @ApiProperty({ example: 'ibroximovv.uz@gmail.com' })
    @IsEmail()
    email: string
}