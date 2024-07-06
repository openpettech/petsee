import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class StoreRequestDto {
  @Expose()
  @IsObject()
  @IsNotEmpty()
  public file: Express.Multer.File;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public bucket: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  public useFilename?: boolean = false;

  @Expose()
  @IsString()
  @IsOptional()
  public region?: string = 'us-east-1';

  @Expose()
  @IsString()
  @IsOptional()
  public path?: string;
}
