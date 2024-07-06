import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CustomFieldValuesFilterDto {
  @Expose()
  @IsUUID('4')
  @IsOptional()
  @ApiProperty()
  public customFieldId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public objectId?: string;
}
