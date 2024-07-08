import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationModel } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class NotificationCenterDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsEnum(NotificationModel)
  @IsNotEmpty()
  @ApiProperty({
    enum: NotificationModel,
    enumName: 'NotificationModel',
  })
  public model: NotificationModel;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public objectId: string;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  public sms: boolean = false;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  public email: boolean = false;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  public mobilePush: boolean = false;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  public webPush: boolean = false;
  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
