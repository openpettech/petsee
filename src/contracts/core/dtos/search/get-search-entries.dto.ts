import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetSearchEntriesDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public indexName: string;
}
