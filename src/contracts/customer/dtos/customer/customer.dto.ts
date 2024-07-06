import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { BaseModel } from '@contracts/common';

@Exclude()
export class CustomerDto extends BaseModel {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty()
  public projectId: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  public name?: string | null;

  @Expose()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  public email?: string | null;

  @Expose()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  public alternativeEmail?: string | null;

  @Expose()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  public phoneNumber?: string | null;

  @Expose()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  public alternativePhoneNumber?: string | null;

  @Expose()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiProperty()
  public tagIds?: string[];

  @Expose()
  @IsObject()
  @IsOptional()
  @ApiProperty()
  public metadata?: object;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty()
  @Transform(({ obj }) => {
    const name = [obj.firstName, obj.middleName, obj.lastName]
      .filter(Boolean)
      .join(' ');
    if (!!name.length) {
      return name;
    }

    return null;
  })
  public fullName?: string | null;
}
