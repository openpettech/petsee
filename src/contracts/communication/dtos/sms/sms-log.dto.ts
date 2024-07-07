import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';
import { SmsStatus } from '@prisma/client';

@Exclude()
export class SmsLogDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public provider: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public providerId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public message: string;

  @Expose()
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  public phoneNumber: string;

  @Expose()
  @IsEnum(SmsStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: SmsStatus,
    enumName: 'SmsStatus',
  })
  public status: SmsStatus;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public error?: string | null;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object;
}
