import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WeightState, WeightUnit, LengthUnit } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class AnimalDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public speciesId: string;

  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public breedId?: string | null;

  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public crossbreedId?: string | null;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public weight?: number | null;

  @Expose()
  @IsEnum(WeightUnit)
  @IsOptional()
  @ApiProperty()
  public weightUnit?: WeightUnit | null;

  @Expose()
  @IsEnum(WeightState)
  @IsOptional()
  @ApiProperty()
  public weightState?: WeightState | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public height?: number | null;

  @Expose()
  @IsEnum(LengthUnit)
  @IsOptional()
  @ApiProperty()
  public heightUnit?: LengthUnit | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public tattooId?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public tattooLocation?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public chipId?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public chipLocation?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public passportId?: string | null;

  @Expose()
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  public dateOfBirth?: string | null;

  @Expose()
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  public dateOfDeath?: string | null;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isFixed: boolean = false;

  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public bloodGroupId?: string | null;

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public allergenIds?: string[];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public tagIds?: string[];

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object;
}
