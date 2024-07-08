import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { NotificationModel } from '@prisma/client';

export class CreateNotificationCenterDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
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
  @IsOptional()
  @ApiProperty()
  public sms: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public email: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public mobilePush: boolean = false;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public webPush: boolean = false;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateNotificationCenterRequest extends OmitType(
  CreateNotificationCenterDto,
  ['projectId', 'createdBy'] as const,
) {}
