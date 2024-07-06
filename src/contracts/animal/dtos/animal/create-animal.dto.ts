import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WeightUnit, WeightState, LengthUnit } from '@prisma/client';

export class CreateAnimalDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public customerId?: string | null;

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
  public isFixed?: boolean = false;

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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateAnimalRequest extends OmitType(CreateAnimalDto, [
  'projectId',
  'createdBy',
] as const) {}
