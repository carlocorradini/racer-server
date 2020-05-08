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

@Entity('championship')
@Check(`"id" > 0`)
export default class Championship {
  @PrimaryColumn({ name: 'id' })
  @Index()
  id!: number;

  @Column({ name: 'name', length: 64, unique: true })
  name!: string;

  @Column({ name: 'logo', length: 256, unique: true })
  logo!: string;

  @Column({ name: 'forum', length: 256, unique: true })
  forum!: string;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
