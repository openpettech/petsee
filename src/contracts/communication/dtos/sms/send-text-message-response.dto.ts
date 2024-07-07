import { SmsStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTextMessageResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public provider: string;

  @Expose()
  @IsEnum(SmsStatus)
  @IsNotEmpty()
  public status: SmsStatus;

  @Expose()
  @IsString()
  @IsOptional()
  public error?: string | null;
}
