/* eslint-disable camelcase */
import {
  PrimaryColumn,
  Index,
  Entity,
  Check,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsEmpty } from 'class-validator';
import CarManufacturer from './CarManufacturer';

@Entity('car')
@Check(`"id" > 0`)
export default class Car {
  @PrimaryColumn({ name: 'id' })
  @Index()
  id!: number;

  @Column({ name: 'name', length: 64, unique: true })
  name!: string;

  @ManyToOne(() => CarManufacturer, (manifacturer) => manifacturer.cars, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer!: CarManufacturer;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
