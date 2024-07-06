import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateWebhookDto {
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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateWebhookRequest extends OmitType(CreateWebhookDto, [
  'projectId',
  'createdBy',
] as const) {}
