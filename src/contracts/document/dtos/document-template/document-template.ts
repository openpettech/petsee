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
import { DocumentTemplateStatus } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class DocumentTemplateDto extends BaseModel {
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
  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @Expose()
  @IsEnum(DocumentTemplateStatus)
  @IsOptional()
  @ApiProperty({
    enum: DocumentTemplateStatus,
    enumName: 'DocumentTemplateStatus',
  })
  public status: DocumentTemplateStatus = DocumentTemplateStatus.ACTIVE;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
