import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { StockLedgerType } from '@prisma/client';

export class StockLedgerTransactionDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
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

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class StockLedgerTransactionRequest extends OmitType(
  StockLedgerTransactionDto,
  ['projectId', 'createdBy'] as const,
) {}
