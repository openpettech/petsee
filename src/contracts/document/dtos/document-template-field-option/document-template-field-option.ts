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
import { DocumentTemplateFieldOptionStatus } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class DocumentTemplateFieldOptionDto extends BaseModel {
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
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public documentTemplateFieldId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public label: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public value: string;

  @Expose()
  @IsEnum(DocumentTemplateFieldOptionStatus)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateFieldOptionStatus,
    enumName: 'DocumentTemplateFieldOptionStatus',
  })
  public status: DocumentTemplateFieldOptionStatus =
    DocumentTemplateFieldOptionStatus.ACTIVE;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
