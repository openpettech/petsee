import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
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

export class CreateServiceDto {
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
  @IsString()
  @IsOptional()
  @ApiProperty()
  public alternateName?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isSpeciesRestricted?: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isBreedRestricted?: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isGroupRestricted?: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isMerchantRestricted?: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isFacilityRestricted?: boolean = false;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  public duration: number;

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public tagIds?: string[] = [];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public speciesIds?: string[] = [];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public breedIds?: string[] = [];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public groupIds?: string[] = [];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public merchantIds?: string[] = [];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public facilityIds?: string[] = [];

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

export class CreateServiceRequest extends OmitType(CreateServiceDto, [
  'projectId',
  'createdBy',
] as const) {}
