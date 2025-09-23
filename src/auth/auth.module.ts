import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'startup-02'
  })],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
