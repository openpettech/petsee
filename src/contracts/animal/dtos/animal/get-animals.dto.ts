import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsUUID } from 'class-validator';

import { AnimalsFilterDto } from './animal-filter.dto';

export class GetAnimalsDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsObject()
  @IsOptional()
  @Type(() => AnimalsFilterDto)
  public filters?: AnimalsFilterDto = {};
}
