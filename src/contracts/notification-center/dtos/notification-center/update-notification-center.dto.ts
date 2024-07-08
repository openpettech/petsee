import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateNotificationCenterDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

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

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;

  @Exclude()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ServiceRole)
  public updatedBy: ServiceRole;
}

export class UpdateNotificationCenterRequest extends OmitType(
  UpdateNotificationCenterDto,
  ['id', 'projectId', 'updatedBy'] as const,
) {}
