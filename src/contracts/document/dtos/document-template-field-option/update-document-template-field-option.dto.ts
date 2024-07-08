import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { DocumentTemplateFieldOptionStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateDocumentTemplateFieldOptionDto {
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
  public value?: string;

  @Expose()
  @IsEnum(DocumentTemplateFieldOptionStatus)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateFieldOptionStatus,
    enumName: 'DocumentTemplateFieldOptionStatus',
  })
  public status?: DocumentTemplateFieldOptionStatus;

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

export class UpdateDocumentTemplateFieldOptionRequest extends OmitType(
  UpdateDocumentTemplateFieldOptionDto,
  ['id', 'projectId', 'updatedBy'] as const,
) {}
