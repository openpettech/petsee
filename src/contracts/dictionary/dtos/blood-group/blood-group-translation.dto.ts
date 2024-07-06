import { IsLocale, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class BloodGroupTranslationDto extends BaseModel {
  @Expose()
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  public bloodGroupId: string;

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
