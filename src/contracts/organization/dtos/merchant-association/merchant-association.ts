import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class MerchantAssociationDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public merchantId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public facilityId: string;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
