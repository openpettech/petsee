import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AnimalOwnershipType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { ServiceRole } from '@contracts/common';

@Exclude()
export class UpdateAnimalRelationshipDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public id: string;

  @Expose()
  @IsEnum(AnimalOwnershipType)
  @IsOptional()
  @ApiProperty({
    enum: AnimalOwnershipType,
  })
  public type?: AnimalOwnershipType;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object;

  @Exclude()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}

export class UpdateAnimalRelationshipRequest extends OmitType(
  UpdateAnimalRelationshipDto,
  ['projectId', 'updatedBy'] as const,
) {}
