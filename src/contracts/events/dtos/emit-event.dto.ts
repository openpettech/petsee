import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';

import { EventAction } from '../enums';
import type { EventNames } from '../enums';

export class EmitEventDto<T = any> {
  @IsString()
  @IsNotEmpty()
  public event: any;

  @IsString()
  @IsNotEmpty()
  public eventName: EventNames;

  @IsUUID('4')
  @IsNotEmpty()
  public projectId?: string;

  @IsString()
  @IsNotEmpty()
  public entity: string;

  @IsString()
  @IsNotEmpty()
  public entityId: string;

  @IsEnum(EventAction)
  @IsNotEmpty()
  public action: EventAction;

  @IsObject()
  @IsOptional()
  public before?: T;

  @IsObject()
  @IsOptional()
  public after?: T;
}
