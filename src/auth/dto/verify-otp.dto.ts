import { ApiProperty } from "@nestjs/swagger";
import { SendOtpDto } from "./send-otp.dto";
import { IsString, MaxLength } from "class-validator";

export class VerifyOtpDto extends SendOtpDto {
    @ApiProperty({ example: '12345' })
    @MaxLength(5)
    @IsString()
    otp: string
}