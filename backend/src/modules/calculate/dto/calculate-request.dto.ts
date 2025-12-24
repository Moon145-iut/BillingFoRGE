import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateRequestDto {
  @ApiProperty({ example: 150, description: 'Number of units consumed' })
  @IsNumber()
  @IsPositive()
  units!: number;
}
