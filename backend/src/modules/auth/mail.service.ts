import { Injectable, OnModuleInit } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
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

  async onModuleInit() {
    if (!process.env.SMTP_HOST) {
      console.log('SMTP not configured; mailer will log OTPs to console.');
      return;
    }

    try {
      await this.transporter.verify();
      console.log('SMTP transporter verified successfully.');
    } catch (err) {
      console.error('SMTP transporter verification failed:', err);
    }
  }

  async testSmtp() {
    if (!process.env.SMTP_HOST) {
      return {
        status: 'not-configured',
        message: 'SMTP not configured in environment',
        config: {
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER ? '***masked***' : 'not set',
          SMTP_FROM: process.env.SMTP_FROM,
        },
      };
    }

    try {
      const verified = await this.transporter.verify();
      return {
        status: verified ? 'success' : 'failure',
        message: 'SMTP credentials verified',
        config: {
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER,
          SMTP_FROM: process.env.SMTP_FROM,
        },
      };
    } catch (err) {
      return {
        status: 'error',
        message: err.message,
        code: err.code,
        responseCode: err.responseCode,
        config: {
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER,
          SMTP_FROM: process.env.SMTP_FROM,
        },
      };
    }
  }

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

