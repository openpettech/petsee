import { IsNotEmpty, IsUUID, IsEnum, IsObject } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';
import { WebhookRequestStatus } from '@prisma/client';

@Exclude()
export class WebhookLogDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
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
}
