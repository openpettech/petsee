import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SendTextMessageRequestDto {
  @Expose()
  @IsPhoneNumber()
  @IsNotEmpty()
  public phoneNumber: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public message: string;

  @Expose()
  @IsString()
  @IsOptional()
  public from?: string = 'Petsee';
}
