/* eslint-disable camelcase */
import {
  Entity,
  Index,
  Column,
  PrimaryColumn,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsEmpty } from 'class-validator';
import UserChampionship from './UserChampionship';
import Car from './Car';
import ChampionshipCircuit from './ChampionshipCircuit';

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

  @ManyToMany(() => Car)
  @JoinTable({
    name: 'championship_car',
    joinColumn: {
      name: 'championship_id',
    },
    inverseJoinColumn: {
      name: 'car_id',
    },
  })
  cars!: Car[];

  @OneToMany(() => UserChampionship, (userChampionship) => userChampionship.championship)
  users!: UserChampionship[];

  @OneToMany(() => ChampionshipCircuit, (championshipCircuit) => championshipCircuit.championship)
  circuits!: ChampionshipCircuit[];

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
