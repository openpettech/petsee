import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateShiftDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public shiftTypeId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public rrule: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public allDay: boolean = false;

  @Expose()
  @IsMilitaryTime()
  @IsNotEmpty()
  @ApiProperty()
  public from: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  public duration: number;

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

export class CreateShiftRequest extends OmitType(CreateShiftDto, [
  'projectId',
  'createdBy',
] as const) {}
