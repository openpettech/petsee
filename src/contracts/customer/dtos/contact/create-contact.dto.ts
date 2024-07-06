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

export class CreateContactDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public customerId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

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
  public metadata?: object;

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateContactRequest extends OmitType(CreateContactDto, [
  'projectId',
  'createdBy',
] as const) {}
