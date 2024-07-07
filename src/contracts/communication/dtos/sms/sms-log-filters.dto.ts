import { SmsStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SmsLogFiltersDto {
  @Expose()
  @IsString()
  @IsOptional()
  public providerId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  public provider?: string;

  @Expose()
  @IsEnum(SmsStatus)
  @IsOptional()
  public status?: SmsStatus;
}
