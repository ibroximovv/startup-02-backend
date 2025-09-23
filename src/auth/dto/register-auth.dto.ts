import { ApiProperty } from "@nestjs/swagger";
import { DirectionLevel } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class RegisterDto {
    @ApiProperty({ example: 'ibroximovv.uz@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password' })
    @IsString()
    password: string

    @ApiProperty({ example: 'image.jpg', required: false })
    @IsOptional()
    @IsString()
    image?: string

    @ApiProperty({ example: 'men ilyosbekman men yaxshi oqiyman', required: false })
    @IsOptional()
    @IsString()
    bio?: string

    @ApiProperty({ example: 'Ilyosbek' })
    @IsString()
    firstName: string

    @ApiProperty({ example: 'Ibroximov' })
    @IsString()
    lastName: string

    @ApiProperty({ example: DirectionLevel.MIDDLE, enum: DirectionLevel })
    @IsEnum(DirectionLevel)
    level: DirectionLevel

    @ApiProperty({ example: 'Dasturlash-frontend va yana koplab sohalardan xabarim bor', required: false })
    @IsOptional()
    @IsString()
    additionalDirection?: string

    @ApiProperty({ example: 'uuid' })
    @IsUUID()
    directionId: UUID
}