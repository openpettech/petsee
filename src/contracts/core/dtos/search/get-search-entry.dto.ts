import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetSearchEntryDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public indexName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public id: string;
}
