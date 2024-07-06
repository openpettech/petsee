import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class ApiKeyDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose({
    groups: ['create'],
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public secretKey: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public last4: string;

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
}
