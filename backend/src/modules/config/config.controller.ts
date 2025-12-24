import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { ConfigResponseDto } from './dto/config-response.dto';
import { AdminSessionGuard } from '../../common/guards/admin-session.guard';

@ApiTags('Configuration')
@Controller('api/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get active billing configuration' })
  async getActiveConfig(): Promise<ConfigResponseDto> {
    return this.configService.getActiveConfig();
  }

  @Post()
  @UseGuards(AdminSessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new billing configuration (admin only)' })
  async createConfig(@Body() createConfigDto: CreateConfigDto): Promise<ConfigResponseDto> {
    return this.configService.createConfig(createConfigDto);
  }
}
