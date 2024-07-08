import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { DocumentTemplateFieldOptionStatus } from '@prisma/client';

export class CreateDocumentTemplateFieldOptionDto {
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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateDocumentTemplateFieldOptionRequest extends OmitType(
  CreateDocumentTemplateFieldOptionDto,
  ['projectId', 'createdBy'] as const,
) {}
