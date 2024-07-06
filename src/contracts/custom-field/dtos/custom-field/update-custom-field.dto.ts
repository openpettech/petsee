import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateCustomFieldDto {
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
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public required?: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public helpText?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public placeholder?: string | null;

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

export class UpdateCustomFieldRequest extends OmitType(UpdateCustomFieldDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
