import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WarehouseStatus } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class WarehouseDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @Expose()
  @IsEnum(WarehouseStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: WarehouseStatus,
  })
  public status: WarehouseStatus;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
