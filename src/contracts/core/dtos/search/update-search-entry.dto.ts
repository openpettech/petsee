import { Expose } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateSearchEntryDto<T = any> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public indexName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public id: string;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  public data: T;
}
