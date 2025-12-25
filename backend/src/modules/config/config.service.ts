import { Injectable } from '@nestjs/common';
import { ConfigRepository } from './config.repository';
import { CreateConfigDto } from './dto/create-config.dto';
import { ConfigResponseDto } from './dto/config-response.dto';

@Injectable()
export class ConfigService {
  private readonly defaultConfig = {
    baseRate: Number(process.env.DEFAULT_BASE_RATE ?? 5),
    taxRate: Number(process.env.DEFAULT_TAX_RATE ?? 5),
    serviceCharge: Number(process.env.DEFAULT_SERVICE_CHARGE ?? 10),
  };

  constructor(private readonly configRepository: ConfigRepository) {}

  async getActiveConfig(): Promise<ConfigResponseDto> {
    try {
      const config = await this.configRepository.findActive();
      if (!config) {
        return this.getDefaultResponse();
      }
      return this.toResponseDto(config);
    } catch (error) {
      console.error('Failed to load active config, falling back to defaults', error);
      return this.getDefaultResponse();
    }
  }

  async createConfig(createConfigDto: CreateConfigDto): Promise<ConfigResponseDto> {
    const config = await this.configRepository.create(createConfigDto);
    return this.toResponseDto(config);
  }

  async resetConfig(): Promise<void> {
    await this.configRepository.deleteAll();
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
      isDefault: false,
    };
  }

  private getDefaultResponse(): ConfigResponseDto {
    return {
      id: 0,
      baseRate: this.defaultConfig.baseRate,
      taxRate: this.defaultConfig.taxRate,
      serviceCharge: this.defaultConfig.serviceCharge,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true,
    };
  }
}
