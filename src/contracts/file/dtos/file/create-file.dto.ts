import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateFileDto {
  @Expose()
  @IsUUID('4')
  @IsOptional()
  public id?: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public filename: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public type: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  public size: number;

  @Expose()
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  public url: string;

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

export class CreateFileRequest extends OmitType(CreateFileDto, [
  'id',
  'projectId',
  'createdBy',
] as const) {}
