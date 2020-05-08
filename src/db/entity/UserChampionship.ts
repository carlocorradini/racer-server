/* eslint-disable camelcase */
import { Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsEmpty, IsInt, IsPositive, IsOptional } from 'class-validator';
import {
  IsValidCar,
  IsValidTeam,
  IsUserChampionshipCarBelongToChampionship,
} from '@app/common/validator';
import User from './User';
import Championship from './Championship';
import Car from './Car';
import Team from './Team';

export enum UserChampionshipValidationGroup {
  // eslint-disable-next-line no-unused-vars
  CREATION = 'creation',
  // eslint-disable-next-line no-unused-vars
  UPDATE = 'update',
}

@Entity('user_championship')
export default class UserChampionship {
  @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @IsEmpty({ always: true })
  user!: User;

  @ManyToOne(() => Championship, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'championship_id' })
  @IsInt({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsPositive({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  championship!: Championship;

  @ManyToOne(() => Car, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  @IsInt({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsPositive({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsValidCar({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsUserChampionshipCarBelongToChampionship({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsOptional({
    groups: [UserChampionshipValidationGroup.UPDATE],
  })
  car!: Car;

  @ManyToOne(() => Team, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  @IsInt({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsPositive({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsValidTeam({
    groups: [UserChampionshipValidationGroup.CREATION, UserChampionshipValidationGroup.UPDATE],
  })
  @IsOptional({ groups: [UserChampionshipValidationGroup.UPDATE] })
  team!: Team;

  @CreateDateColumn({ name: 'created_at', update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
