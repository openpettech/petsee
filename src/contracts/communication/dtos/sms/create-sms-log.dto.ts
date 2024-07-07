import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty } from '@nestjs/swagger';
import { SmsStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSmsLogDto {
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
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  public phoneNumber: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public message: string;

  @Expose()
  @IsEnum(SmsStatus)
  @IsNotEmpty()
  @ApiProperty()
  public status: SmsStatus = SmsStatus.QUEUED;

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
  public createdBy: ServiceRole;
}
