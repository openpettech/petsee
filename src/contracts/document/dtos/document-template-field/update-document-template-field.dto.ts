import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  DocumentTemplateFieldStatus,
  DocumentTemplateFieldType,
} from '@prisma/client';
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
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateDocumentTemplateFieldDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public label?: string;

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
  public required?: boolean;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty()
  public order?: number;

  @Expose()
  @IsEnum(DocumentTemplateFieldStatus)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateFieldStatus,
    enumName: 'DocumentTemplateFieldStatus',
  })
  public status?: DocumentTemplateFieldStatus;

  @Expose()
  @IsEnum(DocumentTemplateFieldType)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateFieldType,
    enumName: 'DocumentTemplateFieldType',
  })
  public type?: DocumentTemplateFieldType;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;

  @Exclude()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}

export class UpdateDocumentTemplateFieldRequest extends OmitType(
  UpdateDocumentTemplateFieldDto,
  ['id', 'projectId', 'updatedBy'] as const,
) {}
