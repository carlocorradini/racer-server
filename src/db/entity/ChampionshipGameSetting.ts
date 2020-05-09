/* eslint-disable camelcase */
import { Entity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { IsEmpty, IsInt, IsPositive, IsOptional, IsString, Length } from 'class-validator';
import Championship from './Championship';
import GameSetting from './GameSetting';

export enum ChampionshipGameSettingValidationGroup {
  // eslint-disable-next-line no-unused-vars
  CREATION = 'creation',
  // eslint-disable-next-line no-unused-vars
  UPDATE = 'update',
}

@Entity('championship_game_setting')
export default class ChampionshipGameSetting {
  @ManyToOne(() => Championship, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'championship_id' })
  @IsInt({
    groups: [ChampionshipGameSettingValidationGroup.CREATION],
  })
  @IsPositive({
    groups: [ChampionshipGameSettingValidationGroup.CREATION],
  })
  @IsEmpty({ groups: [ChampionshipGameSettingValidationGroup.UPDATE] })
  championship!: Championship;

  @ManyToOne(() => GameSetting, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_setting_id' })
  @IsInt({
    groups: [ChampionshipGameSettingValidationGroup.CREATION],
  })
  @IsPositive({
    groups: [ChampionshipGameSettingValidationGroup.CREATION],
  })
  @IsEmpty({ groups: [ChampionshipGameSettingValidationGroup.UPDATE] })
  game_setting!: GameSetting;

  @Column({ name: 'value', length: 128 })
  @IsString({
    groups: [
      ChampionshipGameSettingValidationGroup.CREATION,
      ChampionshipGameSettingValidationGroup.UPDATE,
    ],
  })
  @Length(1, 128, {
    groups: [
      ChampionshipGameSettingValidationGroup.CREATION,
      ChampionshipGameSettingValidationGroup.UPDATE,
    ],
  })
  @IsOptional({ groups: [ChampionshipGameSettingValidationGroup.UPDATE] })
  value!: string;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
