import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class SendTextMessageDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  public phoneNumber: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public message: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public from: string = 'Petsee';
}
