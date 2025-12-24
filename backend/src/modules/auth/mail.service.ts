import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  async sendOtp(email: string, code: string) {
    if (!process.env.SMTP_HOST) {
      // Fallback during local development
      console.log(`OTP for ${email}: ${code}`);
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your Admin Portal OTP',
      text: `Use the following OTP to access the billing admin dashboard: ${code}`,
      html: `<p>Use the following OTP to access the billing admin dashboard:</p><h2>${code}</h2><p>This code expires in 10 minutes.</p>`,
    });
  }
}
