import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { addMinutes, addHours, isBefore } from 'date-fns';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from './mail.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async requestOtp(dto: RequestOtpDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = addMinutes(new Date(), 10);

    await this.prisma.admin_otps.create({
      data: {
        email: dto.email,
        code,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await this.mailService.sendOtp(dto.email, code);

    return { message: 'OTP sent to your email.' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = await this.prisma.admin_otps.findFirst({
      where: {
        email: dto.email,
        consumed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('No OTP request found.');
    }

    if (isBefore(record.expiresAt, new Date())) {
      throw new BadRequestException('OTP has expired.');
    }

    if (record.code !== dto.code) {
      throw new BadRequestException('Invalid OTP.');
    }

    const sessionToken = randomUUID();
    const sessionExpiresAt = addHours(new Date(), 12);

    await this.prisma.admin_otps.update({
      where: { id: record.id },
      data: {
        consumed: true,
        sessionToken,
        sessionExpiresAt,
      },
    });

    return { sessionToken, expiresAt: sessionExpiresAt };
  }

  async validateSession(token: string) {
    if (!token) return null;
    return this.prisma.admin_otps.findFirst({
      where: {
        sessionToken: token,
        sessionExpiresAt: { gt: new Date() },
      },
    });
  }
}
