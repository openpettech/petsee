import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@Exclude()
export class ServiceRole {
  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  public user?: string;

  @Expose()
  @ApiProperty()
  @IsUUID('4')
  @IsOptional()
  public apiKey?: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  public service?: string;

  @Expose()
  @ApiProperty()
  @IsString()
  @IsOptional()
  public serviceDetail?: string;
}

@ValidatorConstraint()
export class IsServiceRoleConstraint implements ValidatorConstraintInterface {
  validate(serviceRole: ServiceRole) {
    if (!serviceRole) return false;

    const { service, serviceDetail, user, apiKey } = serviceRole;

    if (service && serviceDetail) {
      return true;
    }

    if (user) {
      return true;
    }

    if (apiKey) {
      return true;
    }

    return false;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!validationArguments?.value) {
      return `serviceRole is required`;
    }

    return `serviceRole is not valid`;
  }
}

export function IsServiceRole(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsServiceRoleConstraint,
    });
  };
}
