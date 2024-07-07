import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';
import { TaskType, TaskStatus } from '@prisma/client';

@Exclude()
export class TaskDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public personId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public title: string;

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
    default: TaskStatus.TODO,
  })
  public status?: TaskStatus = TaskStatus.TODO;

  @Expose()
  @IsEnum(TaskType)
  @IsOptional()
  @ApiProperty({
    enum: TaskType,
    enumName: 'TaskType',
    default: TaskType.TASK,
  })
  public type?: TaskType = TaskType.TASK;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
