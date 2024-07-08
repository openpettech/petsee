import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  DocumentTemplateFieldStatus,
  DocumentTemplateFieldType,
} from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class DocumentTemplateFieldDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public documentTemplateId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public label: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public helperText?: string | null;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public required: boolean = false;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty()
  public order: number = 0;

  @Expose()
  @IsEnum(DocumentTemplateFieldStatus)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateFieldStatus,
    enumName: 'DocumentTemplateFieldStatus',
  })
  public status: DocumentTemplateFieldStatus =
    DocumentTemplateFieldStatus.ACTIVE;

  @Expose()
  @IsEnum(DocumentTemplateFieldType)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateFieldType,
    enumName: 'DocumentTemplateFieldType',
  })
  public type: DocumentTemplateFieldType;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
