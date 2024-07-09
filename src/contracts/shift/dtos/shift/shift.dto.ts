import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsMilitaryTime,
  IsNumber,
  Min,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class ShiftDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
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
}
