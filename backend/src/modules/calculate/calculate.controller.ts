import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CalculateService } from './calculate.service';
import { CalculateRequestDto } from './dto/calculate-request.dto';
import { CalculateResponseDto } from './dto/calculate-response.dto';

@ApiTags('Calculation')
@Controller('api/calculate')
export class CalculateController {
  constructor(private readonly calculateService: CalculateService) {}

  @Post()
  @ApiOperation({ summary: 'Calculate billing amount based on usage' })
  async calculate(@Body() request: CalculateRequestDto): Promise<CalculateResponseDto> {
    return this.calculateService.calculate(request);
  }
}
