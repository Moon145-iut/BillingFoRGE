import { ApiProperty } from '@nestjs/swagger';

export class CalculateResponseDto {
  @ApiProperty({ example: 150 })
  units!: number;

  @ApiProperty({ example: 10.5 })
  ratePerUnit!: number;

  @ApiProperty({ example: 1575 })
  subtotal!: number;

  @ApiProperty({ example: 126 })
  vatAmount!: number;

  @ApiProperty({ example: 25 })
  serviceCharge!: number;

  @ApiProperty({ example: 1726 })
  total!: number;

  @ApiProperty({ example: 1 })
  configId!: number;
}
