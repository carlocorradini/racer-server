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
import CarManifacturer from './CarManifacturer';

@Entity('car')
@Check(`"id" > 0`)
export default class Car {
  @PrimaryColumn({ name: 'id' })
  @Index()
  id!: number;

  @Column({ name: 'name', length: 64, unique: true })
  name!: string;

  @ManyToOne(() => CarManifacturer, (manifacturer) => manifacturer.cars, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'manifacturer_id' })
  manifacturer!: CarManifacturer;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
