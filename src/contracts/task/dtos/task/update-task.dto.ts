import { ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TaskType, TaskStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class UpdateTaskDto {
  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public projectId: string;

  @Exclude()
  @IsNotEmpty()
  @IsUUID('4')
  public id: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public title?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public text?: string | null;

  @Expose()
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  public due?: string | null;

  @Expose()
  @IsDateString()
  @IsOptional()
  @ApiProperty()
  public remind?: string | null;

  @Expose()
  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({
    enum: TaskStatus,
    enumName: 'TaskStatus',
  })
  public status?: TaskStatus;

  @Expose()
  @IsEnum(TaskType)
  @IsOptional()
  @ApiProperty({
    enum: TaskType,
    enumName: 'TaskType',
  })
  public type?: TaskType;

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

export class UpdateTaskRequest extends OmitType(UpdateTaskDto, [
  'id',
  'projectId',
  'updatedBy',
] as const) {}
