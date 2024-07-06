import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export type Dateable = Date | string | number;

@ValidatorConstraint()
export class IsDateableConstraint implements ValidatorConstraintInterface {
  validate(entry: any) {
    return !isNaN(new Date(entry).getDate());
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value} is not a dateable`;
  }
}

export function IsDateable(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateableConstraint,
    });
  };
}
