import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsISO31661Alpha2,
  IsLatitude,
  IsLongitude,
  IsNumber,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class LocationDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsLatitude()
  @IsOptional()
  @ApiProperty()
  public latitude?: number | null;

  @Expose()
  @IsLongitude()
  @IsOptional()
  @ApiProperty()
  public longitude?: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public altitude?: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public accuracy?: number | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public street?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public houseNumber?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public apartment?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public city?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public state?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public postalCode?: string | null;

  @Expose()
  @IsISO31661Alpha2()
  @IsOptional()
  @ApiProperty({
    examples: ['us', 'fr'],
  })
  public country?: string | null;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
