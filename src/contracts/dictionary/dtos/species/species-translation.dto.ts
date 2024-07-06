import { IsLocale, IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class SpeciesTranslationDto extends BaseModel {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public speciesId: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @ApiProperty()
  @IsLocale()
  @IsNotEmpty()
  public locale: string;
}
