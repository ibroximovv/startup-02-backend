import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({ example: 'ibroximovv@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password' })
    @IsString()
    password: string
}