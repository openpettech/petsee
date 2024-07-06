import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID, IsOptional } from 'class-validator';

export class CustomFieldOptionsFilterDto {
  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public customFieldId?: string;
}
