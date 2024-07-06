import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdatePersonDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

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
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}

export class UpdatePersonRequest extends OmitType(UpdatePersonDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
