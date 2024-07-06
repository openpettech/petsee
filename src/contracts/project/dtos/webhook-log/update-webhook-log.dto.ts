import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WebhookRequestStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateWebhookLogDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public webhookId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public request?: any;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public response?: any;

  @Expose()
  @IsEnum(WebhookRequestStatus)
  @IsOptional()
  @ApiProperty({
    enum: WebhookRequestStatus,
    enumName: 'WebhookRequestStatus',
  })
  public status?: WebhookRequestStatus;

  @Exclude()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}

export class UpdateWebhookLogRequest extends OmitType(UpdateWebhookLogDto, [
  'id',
  'updatedBy',
] as const) {}
