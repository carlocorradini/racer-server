import {
  ValidatorConstraint,
  // eslint-disable-next-line no-unused-vars
  ValidatorConstraintInterface,
  registerDecorator,
  // eslint-disable-next-line no-unused-vars
  ValidationOptions,
  // eslint-disable-next-line no-unused-vars
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';
// eslint-disable-next-line no-unused-vars
import UserChampionship from '@app/db/entity/UserChampionship';

@ValidatorConstraint({ async: true })
export class IsUserChampionshipCarBelongToChampionshipConstraint
  implements ValidatorConstraintInterface {
  private car: number = 0;

  private championship: number = 0;

  async validate(id: number, args: ValidationArguments) {
    this.car = id;
    this.championship = ((args.object as UserChampionship).championship as unknown) as number;

    if (this.car === undefined || this.championship === undefined) return false;

    return (
      (await getManager()
        .createQueryBuilder('ChampionshipCar', 'cc')
        .where('cc.championship = :championship', { championship: 1 })
        .andWhere('cc.car = :car', { car: 1 })
        .getCount()) === 1
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} ${
      this.car !== undefined ? this.car : '?'
    } cannot be used in Championship ${this.championship !== undefined ? this.championship : '?'}`;
  }
}

export default function IsUserChampionshipCarBelongToChampionship(
  validationOptions?: ValidationOptions
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isUserChampionshipCarBelongToChampionship',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUserChampionshipCarBelongToChampionshipConstraint,
    });
  };
}
