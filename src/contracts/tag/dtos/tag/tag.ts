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
import { TagType } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class TagDto extends BaseModel {
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
  @IsEnum(TagType)
  @IsNotEmpty()
  @ApiProperty({
    enum: TagType,
  })
  public type: TagType;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
