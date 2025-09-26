import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { GetAuthDto } from './dto/get-auth-dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth-user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto)
  }
  
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto)
  }

  @Post('register')
  register(@Body() registerAuthDto: RegisterDto) {
    return this.authService.create(registerAuthDto)
  }

  @Post('login')
  login(@Body() loginAuthdto: LoginAuthDto) {
    return this.authService.login(loginAuthdto)
  }

  @Get()
  findAll(@Query() query: GetAuthDto) {
    return this.authService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
