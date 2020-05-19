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
} from 'typeorm';
import { IsEmpty } from 'class-validator';
import UserChampionship from './UserChampionship';
import ChampionshipCircuit from './ChampionshipCircuit';
import ChampionshipGameSetting from './ChampionshipGameSetting';
import ChampionshipCar from './ChampionshipCar';
// eslint-disable-next-line no-unused-vars
import Team from './Team';

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

  @OneToMany(() => ChampionshipCar, (championshipCar) => championshipCar.championship)
  cars!: ChampionshipCar[];

  @OneToMany(() => UserChampionship, (userChampionship) => userChampionship.championship)
  users!: UserChampionship[];

  @OneToMany(() => ChampionshipCircuit, (championshipCircuit) => championshipCircuit.championship)
  circuits!: ChampionshipCircuit[];

  teams!: number[];

  @OneToMany(
    () => ChampionshipGameSetting,
    (championshipGameSetting) => championshipGameSetting.championship
  )
  game_settings!: ChampionshipGameSetting[];

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
