import { ApiProperty } from '@nestjs/swagger';
import { NotificationModel } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class NotificationCenterFiltersDto {
  @Expose()
  @IsEnum(NotificationModel)
  @IsOptional()
  @ApiProperty({
    enum: NotificationModel,
    enumName: 'NotificationModel',
  })
  public model?: NotificationModel;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public objectId?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public sms?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public email?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public mobilePush?: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public webPush?: boolean;
}
