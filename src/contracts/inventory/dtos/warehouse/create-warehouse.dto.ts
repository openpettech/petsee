import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WarehouseStatus } from '@prisma/client';

export class CreateWarehouseDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @Expose()
  @IsEnum(WarehouseStatus)
  @IsOptional()
  @ApiProperty({
    enum: WarehouseStatus,
  })
  public status?: WarehouseStatus = WarehouseStatus.ACTIVE;

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

export class CreateWarehouseRequest extends OmitType(CreateWarehouseDto, [
  'projectId',
  'createdBy',
] as const) {}
