import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class AnimalRelationshipFiltersDto {
  @Expose()
  @IsUUID('4')
  @ApiProperty()
  @IsOptional()
  public animalId?: string;

  @Expose()
  @IsUUID('4')
  @ApiProperty()
  @IsOptional()
  public customerId?: string;
}
