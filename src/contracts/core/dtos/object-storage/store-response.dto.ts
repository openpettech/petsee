import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class StoreResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public id: string;

  @Expose()
  @IsUrl()
  @IsNotEmpty()
  public url: string;
}
