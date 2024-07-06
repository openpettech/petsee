import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsServiceRole, ServiceRole } from '@contracts/common';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateProjectDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public createdBy: ServiceRole;
}

export class CreateProjectRequest extends OmitType(CreateProjectDto, [
  'createdBy',
] as const) {}
