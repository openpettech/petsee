import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreatePersonDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public firstName?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public middleName?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public lastName?: string | null;

  @Expose()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  public email?: string | null;

  @Expose()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  public alternativeEmail?: string | null;

  @Expose()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  public phoneNumber?: string | null;

  @Expose()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  public alternativePhoneNumber?: string | null;

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

export class CreatePersonRequest extends OmitType(CreatePersonDto, [
  'projectId',
  'createdBy',
] as const) {}
