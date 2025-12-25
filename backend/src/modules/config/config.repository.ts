import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConfigDto } from './dto/create-config.dto';

@Injectable()
export class ConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    return this.prisma.billingConfig.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateConfigDto) {
    // Deactivate all previous configs
    await this.prisma.billingConfig.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // Create new config
    return this.prisma.billingConfig.create({
      data: {
        baseRate: data.baseRate,
        taxRate: data.taxRate,
        discount: 0,
        serviceCharge: data.serviceCharge,
        active: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.billingConfig.findUnique({
      where: { id },
    });
  }

  async deleteAll() {
    await this.prisma.billingConfig.deleteMany({});
  }
}
