import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class ServiceDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
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
}
