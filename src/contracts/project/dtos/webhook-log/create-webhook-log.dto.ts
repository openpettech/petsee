import { Exclude, Expose, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsObject, IsUUID } from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { WebhookRequestStatus } from '@prisma/client';

export class CreateWebhookLogDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public webhookId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  public request: any;

  @Expose()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  public response: any;

  @Expose()
  @IsEnum(WebhookRequestStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: WebhookRequestStatus,
    enumName: 'WebhookRequestStatus',
  })
  public status: WebhookRequestStatus;

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateWebhookLogRequest extends OmitType(CreateWebhookLogDto, [
  'webhookId',
  'projectId',
  'createdBy',
] as const) {}
