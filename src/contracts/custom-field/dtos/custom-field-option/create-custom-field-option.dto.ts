import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateCustomFieldOptionDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public customFieldId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public label: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public value: string;

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

export class CreateCustomFieldOptionRequest extends OmitType(
  CreateCustomFieldOptionDto,
  ['projectId', 'createdBy'] as const,
) {}
