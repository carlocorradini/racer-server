/* eslint-disable camelcase */
import { Entity, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmpty } from 'class-validator';
import Championship from './Championship';

@Entity('championship_photo')
export default class ChampionshipPhoto {
  @ManyToOne(() => Championship, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'championship_id' })
  championship!: Championship;

  @Column({ name: 'photo', length: 256, primary: true })
  photo!: string;

  @CreateDateColumn({ name: 'created_at', update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
