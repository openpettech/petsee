import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

import { CustomFieldsFilterDto } from './custom-fields-filter.dto';

export class GetCustomFieldsDto {
  @Expose()
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsObject()
  @IsOptional()
  @Type(() => CustomFieldsFilterDto)
  public filters?: CustomFieldsFilterDto = {};
}
