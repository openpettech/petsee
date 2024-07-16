import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsObject } from 'class-validator';

import { SearchMetaDto } from './search-meta.dto';

export class SearchResultsDto<T> {
  @Expose()
  @IsObject({ each: true })
  @ApiProperty({ isArray: true })
  readonly items: T[];

  @Expose()
  @IsObject()
  @ApiProperty({ type: () => SearchMetaDto })
  readonly meta: SearchMetaDto;

  constructor(items: T[], meta: SearchMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}
