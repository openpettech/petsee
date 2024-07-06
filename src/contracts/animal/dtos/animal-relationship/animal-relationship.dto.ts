import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';
import { AnimalOwnershipType } from '@prisma/client';

@Exclude()
export class AnimalRelationshipDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public animalId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public customerId: string;

  @Expose()
  @IsEnum(AnimalOwnershipType)
  @IsNotEmpty()
  @ApiProperty({
    enum: AnimalOwnershipType,
  })
  public type: AnimalOwnershipType;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object;
}
