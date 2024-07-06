import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceOverrideType } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class ServiceOverrideDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public serviceId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public objectId: string;

  @Expose()
  @IsEnum(ServiceOverrideType)
  @IsNotEmpty()
  @ApiProperty()
  public type: ServiceOverrideType;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public duration?: number;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
