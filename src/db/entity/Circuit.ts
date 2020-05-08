/* eslint-disable camelcase */
import {
  Entity,
  Index,
  Column,
  PrimaryColumn,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmpty } from 'class-validator';

@Entity('circuit')
@Check(`"id" > 0`)
export default class Circuit {
  @PrimaryColumn({ name: 'id' })
  @Index()
  id!: number;

  @Column({ name: 'name', length: 64, unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
