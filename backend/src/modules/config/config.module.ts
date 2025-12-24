import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { ConfigRepository } from './config.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminSessionGuard } from '../../common/guards/admin-session.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ConfigController],
  providers: [ConfigService, ConfigRepository, AdminSessionGuard],
  exports: [ConfigService],
})
export class ConfigModule {}
