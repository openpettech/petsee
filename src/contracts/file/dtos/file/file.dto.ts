import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class FileDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public filename: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public type: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  public size: number;

  @Expose()
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  public url: string;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
