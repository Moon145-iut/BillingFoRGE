import { IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigDto {
  @ApiProperty({ example: 10.5, description: 'Base rate for billing' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  baseRate!: number;

  @ApiProperty({ example: 8, description: 'Tax rate percentage' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  taxRate!: number;

  @ApiProperty({ example: 5, description: 'Fixed service charge in dollars' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  serviceCharge!: number;
}
