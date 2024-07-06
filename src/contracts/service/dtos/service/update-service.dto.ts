import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
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
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateServiceDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public name?: string;

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
  public isSpeciesRestricted?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isBreedRestricted?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isGroupRestricted?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isMerchantRestricted?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public isFacilityRestricted?: boolean;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty()
  public duration?: number;

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public tagIds?: string[];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public speciesIds?: string[];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public breedIds?: string[];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public groupIds?: string[];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public merchantIds?: string[];

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public facilityIds?: string[];

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

export class UpdateServiceRequest extends OmitType(UpdateServiceDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
