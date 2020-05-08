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
import Circuit from '@app/db/entity/Circuit';

@ValidatorConstraint({ async: true })
export class IsValidCircuitConstraint implements ValidatorConstraintInterface {
  async validate(id: number) {
    return (await getManager().findOne(Circuit, id)) !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid identifier, ${args.value} is unknown`;
  }
}

export default function IsValidCircuit(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidCircuit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidCircuitConstraint,
    });
  };
}
