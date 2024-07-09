import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
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
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateShiftDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public shiftTypeId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public rrule?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public allDay?: boolean;

  @Expose()
  @IsMilitaryTime()
  @IsOptional()
  @ApiProperty()
  public from?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty()
  public duration?: number;

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

export class UpdateShiftRequest extends OmitType(UpdateShiftDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
