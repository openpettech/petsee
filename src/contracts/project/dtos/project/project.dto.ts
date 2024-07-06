import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class ProjectDto extends BaseModel {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;
}
