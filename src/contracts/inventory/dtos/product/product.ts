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
import { ProductStatus } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class ProductDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public brandId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @Expose()
  @IsEnum(ProductStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: ProductStatus,
  })
  public status: ProductStatus;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
