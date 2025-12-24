import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigRepository } from './config.repository';
import { CreateConfigDto } from './dto/create-config.dto';
import { ConfigResponseDto } from './dto/config-response.dto';

@Injectable()
export class ConfigService {
  constructor(private readonly configRepository: ConfigRepository) {}

  async getActiveConfig(): Promise<ConfigResponseDto> {
    const config = await this.configRepository.findActive();
    if (!config) {
      throw new NotFoundException('No active configuration found. Please create one first.');
    }
    return this.toResponseDto(config);
  }

  async createConfig(createConfigDto: CreateConfigDto): Promise<ConfigResponseDto> {
    const config = await this.configRepository.create(createConfigDto);
    return this.toResponseDto(config);
  }

  private toResponseDto(config: any): ConfigResponseDto {
    return {
      id: config.id,
      baseRate: Number(config.baseRate),
      taxRate: Number(config.taxRate),
      serviceCharge: Number(config.serviceCharge),
      active: config.active,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}
