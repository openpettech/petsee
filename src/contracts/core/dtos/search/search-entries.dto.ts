import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class SearchEntriesDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public indexName: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsOptional()
  @IsString()
  query: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
