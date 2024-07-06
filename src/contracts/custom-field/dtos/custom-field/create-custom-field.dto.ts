import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CustomFieldType, CustomFieldModel } from '@prisma/client';

export class CreateCustomFieldDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateCustomFieldRequest extends OmitType(CreateCustomFieldDto, [
  'projectId',
  'createdBy',
] as const) {}
