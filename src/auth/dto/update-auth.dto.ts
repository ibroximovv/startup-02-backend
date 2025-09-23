import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RegisterDto } from './register-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterDto) {}
