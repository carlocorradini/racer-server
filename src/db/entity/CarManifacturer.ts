/* eslint-disable camelcase */
import {
  Entity,
  Check,
  PrimaryColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmpty } from 'class-validator';
import Car from './Car';

@Entity('car_manifacturer')
@Check(`"id" > 0`)
export default class CarManifacturer {
  @PrimaryColumn({ name: 'id' })
  @Index()
  id!: number;

  @Column({ name: 'name', length: 64, unique: true })
  name!: string;

  @OneToMany(() => Car, (car) => car.manifacturer)
  cars!: Car[];

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
