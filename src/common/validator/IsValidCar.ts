/* eslint-disable class-methods-use-this */
import {
  ValidatorConstraint,
  // eslint-disable-next-line no-unused-vars
  ValidatorConstraintInterface,
  // eslint-disable-next-line no-unused-vars
  ValidationOptions,
  registerDecorator,
  // eslint-disable-next-line no-unused-vars
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';
import Car from '@app/db/entity/Car';

@ValidatorConstraint({ async: true })
export class IsValidCarConstraint implements ValidatorConstraintInterface {
  async validate(id: number) {
    return (await getManager().findOne(Car, id)) !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid identifier, ${args.value} is unknown`;
  }
}

export default function IsValidCar(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidCar',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidCarConstraint,
    });
  };
}
