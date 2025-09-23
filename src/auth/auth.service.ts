import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { totp } from 'otplib';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { BcryptEncryption } from 'src/bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { GetAuthDto } from './dto/get-auth-dto';

totp.options = {
  step: 300,
  digits: 5
}

function generateSimpleUsername(): string {
  const words = [
    "cool", "wolf", "lion", "tiger", "coder",
    "thor", "dragon", "fox", "eagle", "panther",
    "bear", "wizard", "knight", "ghost", "pirate",
    "robot", "star", "moon", "sun", "storm", "flame",
    "shadow", "hunter", "rider", "hero", "king", "queen"
  ];

  const word = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(100 + Math.random() * 900);

  return `${word}${number}`;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly mail: MailService) { }

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      const otp = totp.generate(sendOtpDto.email + 'startup-02')
      await this.mail.sendSmsToMail(sendOtpDto.email, 'Verification code', '..........', `<div style="text-align: center; background-color: gray; color: white; font-size: 30px; margin-top: 20px"><h1>${otp}</h1></div>`)
      return { message: 'Successfully sent sms!' }
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const verifyOtp = totp.verify({ token: verifyOtpDto.otp, secret: verifyOtpDto.email + 'startup-02' })
      return verifyOtp
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'INternal server error!')
    }
  }
  async create(createAuthDto: RegisterDto) {
    try {
      const findone = await this.prisma.users.findFirst({ where: { email: createAuthDto.email } })
      if (findone) throw new BadRequestException('User already exists!')
      const findDirection = await this.prisma.direction.findFirst({ where: { id: createAuthDto.directionId } })
      if (!findDirection) throw new BadRequestException('Direction not found')
      const hashedPassword = await BcryptEncryption.encrypt(createAuthDto.password)

      let username: string;

      while (true) {
        username = generateSimpleUsername();
        const exists = await this.prisma.users.findFirst({ where: { username } })
        if (!exists) break
      }

      return await this.prisma.users.create({
        data: {
          ...createAuthDto,
          password: hashedPassword,
          username
        }
      })

    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const findone = await this.prisma.users.findFirst({ where: { email: loginAuthDto.email } })
      if (!findone) throw new BadRequestException('User not found!')
      const matchPassword = await BcryptEncryption.compare(loginAuthDto.password, findone.password)
      if (!matchPassword) throw new BadRequestException('Email or password not provided!')
      const token = this.jwt.sign({ id: findone.id, role: findone.role })
      return { token }
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findAll(query: GetAuthDto) {
    const { page = 1, pageSize = 10, search, sortOrder = 'asc', sortBy, directionId, directionLevel } = query;
    try {
      const where: any = {}

      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (directionId) {
        where.directionId = directionId
      }

      if (directionLevel) {
        where.directionLevel = directionLevel
      }

      const skip = (Math.max(page, 1) - 1) * pageSize;
      const take = pageSize;

      const [data, total] = await Promise.all([
        this.prisma.users.findMany({
          where,
          skip,
          take,
          orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
          omit: { password: true }
        }),
        this.prisma.users.count({ where })
      ]);

      const totalPages = Math.ceil(total / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.users.findFirst({ where: { id }, omit: { password: true } })
      if (!findone) throw new BadRequestException('User not found!')
      return findone
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    try {
      const findone = await this.prisma.users.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('User not found!')
      if (updateAuthDto.directionId) {
        const direction = await this.prisma.direction.findFirst({
          where: { id: updateAuthDto.directionId },
        });
        if (!direction) throw new BadRequestException('Direction not found!');
      }
      let hashedPassword = findone.password
      if (updateAuthDto.password) {
        hashedPassword = await BcryptEncryption.encrypt(updateAuthDto.password)
      }
      return await this.prisma.users.update({ where: { id }, data: { ...updateAuthDto, password: hashedPassword } })
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      return await this.prisma.users.delete({ where: { id } })
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error!')
    }
  }
}
