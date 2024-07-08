import { ApiProperty } from '@nestjs/swagger';
import { ResourceTypeStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class ResourceTypeFiltersDto {
  @Expose()
  @IsEnum(ResourceTypeStatus)
  @ApiProperty({
    enum: ResourceTypeStatus,
    enumName: 'ResourceTypeStatus',
  })
  @IsOptional()
  public status?: ResourceTypeStatus | null;
}
