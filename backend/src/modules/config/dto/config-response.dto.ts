import { ApiProperty } from '@nestjs/swagger';

export class ConfigResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 10.5 })
  baseRate!: number;

  @ApiProperty({ example: 8 })
  taxRate!: number;

  @ApiProperty({ example: 12.5 })
  serviceCharge!: number;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;
}
