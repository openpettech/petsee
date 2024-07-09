import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsISO31661Alpha2,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateLocationDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsLatitude()
  @IsOptional()
  @ApiProperty()
  public latitude?: number | null;

  @Expose()
  @IsLongitude()
  @IsOptional()
  @ApiProperty()
  public longitude?: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public altitude?: number | null;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  public accuracy?: number | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public street?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public houseNumber?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public apartment?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public city?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public state?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public postalCode?: string | null;

  @Expose()
  @IsISO31661Alpha2()
  @IsOptional()
  @ApiProperty({
    examples: ['us', 'fr'],
  })
  public country?: string | null;

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

export class CreateLocationRequest extends OmitType(CreateLocationDto, [
  'projectId',
  'createdBy',
] as const) {}
