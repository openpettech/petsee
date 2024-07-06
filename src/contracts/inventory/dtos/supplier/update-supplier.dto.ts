import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SupplierStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateSupplierDto {
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
  public name?: string;

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
  @IsEnum(SupplierStatus)
  @IsOptional()
  @ApiProperty({
    enum: SupplierStatus,
  })
  public status?: SupplierStatus;

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

export class UpdateSupplierRequest extends OmitType(UpdateSupplierDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
