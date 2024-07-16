import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class AnimalFiltersDto {
  @Expose()
  @IsUUID('4')
  @ApiProperty()
  @IsOptional()
  public speciesId?: string;

  @Expose()
  @IsUUID('4')
  @ApiProperty()
  @IsOptional()
  public breedId?: string;

  @Expose()
  @IsUUID('4')
  @ApiProperty()
  @IsOptional()
  public crossbreedId?: string;
}
