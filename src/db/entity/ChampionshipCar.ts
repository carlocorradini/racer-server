/* eslint-disable camelcase */
import { Entity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmpty, IsInt, IsPositive } from 'class-validator';
import Championship from './Championship';
import Car from './Car';

export enum ChampionshipCarValidationGroup {
  // eslint-disable-next-line no-unused-vars
  CREATION = 'creation',
  // eslint-disable-next-line no-unused-vars
  UPDATE = 'update',
}

@Entity('championship_car')
export default class ChampionshipCar {
  @ManyToOne(() => Championship, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'championship_id' })
  @IsInt({
    groups: [ChampionshipCarValidationGroup.CREATION],
  })
  @IsPositive({
    groups: [ChampionshipCarValidationGroup.CREATION],
  })
  @IsEmpty({ groups: [ChampionshipCarValidationGroup.UPDATE] })
  championship!: Championship;

  @ManyToOne(() => Car, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  @IsInt({
    groups: [ChampionshipCarValidationGroup.CREATION],
  })
  @IsPositive({
    groups: [ChampionshipCarValidationGroup.CREATION],
  })
  @IsEmpty({ groups: [ChampionshipCarValidationGroup.UPDATE] })
  car!: Car;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
