import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateWebhookDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

  @Expose()
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  public url?: string;

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
  public events?: string[];

  @Exclude()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}

export class UpdateWebhookRequest extends OmitType(UpdateWebhookDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
