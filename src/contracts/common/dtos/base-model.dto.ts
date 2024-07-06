import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import {
  Dateable,
  IsDateable,
  IsServiceRole,
  ServiceRole,
} from '../decorators';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BaseModel {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public id: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  @IsDateable()
  @IsNotEmpty()
  public createdAt: Dateable;

  @Exclude()
  @ApiProperty({
    type: ServiceRole,
  })
  @IsServiceRole()
  @IsNotEmpty()
  @Type(() => ServiceRole)
  @ValidateNested()
  public createdBy: ServiceRole;

  @Expose()
  @ApiProperty({
    type: String,
  })
  @IsDateable()
  @IsNotEmpty()
  public updatedAt: Dateable;

  @Exclude()
  @ApiProperty({
    type: ServiceRole,
  })
  @IsServiceRole()
  @IsNotEmpty()
  @Type(() => ServiceRole)
  @ValidateNested()
  public updatedBy: ServiceRole;

  @Expose()
  @ApiProperty({
    type: String,
  })
  @IsDateable()
  @IsNotEmpty()
  public deletedAt: Dateable;

  @Exclude()
  @ApiProperty({
    type: ServiceRole,
  })
  @IsServiceRole()
  @IsNotEmpty()
  @Type(() => ServiceRole)
  @ValidateNested()
  public deletedBy: ServiceRole;
}
