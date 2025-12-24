import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CalculateRequestDto } from './dto/calculate-request.dto';
import { CalculateResponseDto } from './dto/calculate-response.dto';

@Injectable()
export class CalculateService {
  constructor(private readonly configService: ConfigService) {}

  async calculate(request: CalculateRequestDto): Promise<CalculateResponseDto> {
    const config = await this.configService.getActiveConfig();

    const baseAmount = request.units * config.baseRate;
    const taxAmount = (baseAmount * config.taxRate) / 100;
    const serviceCharge = config.serviceCharge;
    const total = baseAmount + taxAmount + serviceCharge;

    return {
      units: request.units,
      ratePerUnit: config.baseRate,
      subtotal: baseAmount,
      vatAmount: taxAmount,
      serviceCharge,
      total,
      configId: config.id,
    };
  }
}
