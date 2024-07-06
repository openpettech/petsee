import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class WebhookDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  public url: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public label?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @Expose()
  @IsString({
    each: true,
  })
  @IsNotEmpty()
  @ApiProperty({
    isArray: true,
  })
  public events: string[];
}
