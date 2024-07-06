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

import { NoteModel } from '@prisma/client';

export class CreateNoteDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public title: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public note: string;

  @Expose()
  @IsEnum(NoteModel)
  @IsNotEmpty()
  @ApiProperty({
    enum: NoteModel,
  })
  public model: NoteModel;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public objectId: string;

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

export class CreateNoteRequest extends OmitType(CreateNoteDto, [
  'projectId',
  'createdBy',
] as const) {}
