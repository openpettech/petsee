import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { AnimalOwnershipType } from '@prisma/client';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsServiceRole, ServiceRole } from '@contracts/common';

export class CreateAnimalRelationshipDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateAnimalRelationshipRequest extends OmitType(
  CreateAnimalRelationshipDto,
  ['projectId', 'createdBy'] as const,
) {}
