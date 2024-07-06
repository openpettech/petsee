import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BrandStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateBrandDto {
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
  public description?: string | null;

  @Expose()
  @IsEnum(BrandStatus)
  @IsOptional()
  @ApiProperty({
    enum: BrandStatus,
  })
  public status?: BrandStatus;

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

export class UpdateBrandRequest extends OmitType(UpdateBrandDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
