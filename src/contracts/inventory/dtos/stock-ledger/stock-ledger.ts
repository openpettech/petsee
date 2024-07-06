import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StockLedgerType } from '@prisma/client';

import { BaseModel } from '@contracts/common';

@Exclude()
export class StockLedgerDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public productId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public warehouseId: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  public quantity: number;

  @Expose()
  @IsEnum(StockLedgerType)
  @IsNotEmpty()
  @ApiProperty({
    enum: StockLedgerType,
  })
  public type: StockLedgerType;

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object | null;
}
