import { ApiProperty } from '@nestjs/swagger';
import { ShiftTypeStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class ShiftTypeFiltersDto {
  @Expose()
  @IsEnum(ShiftTypeStatus)
  @ApiProperty({
    enum: ShiftTypeStatus,
    enumName: 'ShiftTypeStatus',
  })
  @IsOptional()
  public status?: ShiftTypeStatus | null;
}
