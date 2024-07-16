import { ApiProperty } from '@nestjs/swagger';

export class SearchMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly pageCount: number;

  constructor({ page, limit, total, pageCount }: SearchMetaDto) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.pageCount = pageCount;
  }
}
