import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  DocumentTemplateFieldStatus,
  DocumentTemplateFieldType,
} from '@prisma/client';

export class CreateDocumentTemplateFieldDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateDocumentTemplateFieldRequest extends OmitType(
  CreateDocumentTemplateFieldDto,
  ['projectId', 'createdBy'] as const,
) {}
