import { ApiProperty } from '@nestjs/swagger';
import { ResourceStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ResourceFiltersDto {
  @Expose()
  @IsEnum(ResourceStatus)
  @ApiProperty({
    enum: ResourceStatus,
    enumName: 'ResourceStatus',
  })
  @IsOptional()
  public status?: ResourceStatus | null;

  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public resourceTypeId?: string;
}
