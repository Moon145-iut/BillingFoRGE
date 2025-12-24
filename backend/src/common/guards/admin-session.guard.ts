import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-admin-session'] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Missing admin session token');
    }

    const session = await this.prisma.adminOtp.findFirst({
      where: {
        sessionToken: token,
        sessionExpiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired admin session');
    }

    request.adminSession = session;
    return true;
  }
}
