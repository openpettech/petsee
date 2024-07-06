import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';
import { ReferenceValueTranslationDto } from './reference-value-translation.dto';

@Exclude()
export class ReferenceValueDto extends BaseModel {
  @Expose()
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  public speciesId: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public unit: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public min?: number | null;

  @Expose()
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public max?: number | null;

  @Expose()
  @ApiProperty({
    type: ReferenceValueTranslationDto,
    isArray: true,
  })
  @IsObject({ each: true })
  @IsOptional()
  public translations: ReferenceValueTranslationDto[];
}
