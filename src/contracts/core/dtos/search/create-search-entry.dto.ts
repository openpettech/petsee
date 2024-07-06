import { Expose } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSearchEntryDto<T = any> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public indexName: string;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  public data: T;
}
