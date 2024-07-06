import { ApiProperty } from '@nestjs/swagger';
import { CustomFieldModel, CustomFieldType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class CustomFieldsFilterDto {
  @Expose()
  @IsEnum(CustomFieldModel)
  @ApiProperty({
    enum: CustomFieldModel,
    enumName: 'CustomFieldModel',
  })
  @IsOptional()
  public model?: CustomFieldModel | null;

  @Expose()
  @IsEnum(CustomFieldType)
  @ApiProperty({
    enum: CustomFieldType,
    enumName: 'CustomFieldType',
  })
  @IsOptional()
  public type?: CustomFieldType | null;
}
