import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty } from '@nestjs/swagger';
import { SmsStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateSmsLogDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public id: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsEnum(SmsStatus)
  @IsNotEmpty()
  @ApiProperty()
  public status?: SmsStatus;

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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}
