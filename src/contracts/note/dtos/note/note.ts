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
import { NoteModel } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class NoteDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
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
}
