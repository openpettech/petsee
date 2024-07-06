import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ServiceOverrideType } from '@prisma/client';

export class CreateServiceOverrideDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public serviceId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public objectId: string;

  @Expose()
  @IsEnum(ServiceOverrideType)
  @IsNotEmpty()
  @ApiProperty()
  public type: ServiceOverrideType;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public duration?: number;

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

export class CreateServiceOverrideRequest extends OmitType(
  CreateServiceOverrideDto,
  ['projectId', 'createdBy'] as const,
) {}
