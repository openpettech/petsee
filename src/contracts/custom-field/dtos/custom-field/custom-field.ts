import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';
import { CustomFieldModel, CustomFieldType } from '@prisma/client';

@Exclude()
export class CustomFieldDto extends BaseModel {
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
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  public required?: boolean = false;

  @Expose()
  @IsEnum(CustomFieldType)
  @IsNotEmpty()
  @ApiProperty({
    enum: CustomFieldType,
    enumName: 'CustomFieldType',
  })
  public type: CustomFieldType;

  @Expose()
  @IsEnum(CustomFieldModel)
  @IsNotEmpty()
  @ApiProperty({
    enum: CustomFieldModel,
    enumName: 'CustomFieldModel',
  })
  public model: CustomFieldModel;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public helpText?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public placeholder?: string | null;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
