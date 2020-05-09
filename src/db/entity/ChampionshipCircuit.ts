/* eslint-disable camelcase */
import { Entity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { IsEmpty, IsInt, IsPositive, IsISO8601, IsOptional } from 'class-validator';
import Championship from './Championship';
import Circuit from './Circuit';

export enum ChampionshipCircuitValidationGroup {
  // eslint-disable-next-line no-unused-vars
  CREATION = 'creation',
  // eslint-disable-next-line no-unused-vars
  UPDATE = 'update',
}

@Entity('championship_circuit')
export default class ChampionshipCircuit {
  @ManyToOne(() => Championship, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'championship_id' })
  @IsInt({
    groups: [ChampionshipCircuitValidationGroup.CREATION],
  })
  @IsPositive({
    groups: [ChampionshipCircuitValidationGroup.CREATION],
  })
  @IsEmpty({ groups: [ChampionshipCircuitValidationGroup.UPDATE] })
  championship!: Championship;

  @ManyToOne(() => Circuit, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'circuit_id' })
  @IsInt({
    groups: [ChampionshipCircuitValidationGroup.CREATION],
  })
  @IsPositive({
    groups: [ChampionshipCircuitValidationGroup.CREATION],
  })
  @IsEmpty({ groups: [ChampionshipCircuitValidationGroup.UPDATE] })
  circuit!: Circuit;

  @Column({ name: 'date', type: 'date' })
  @IsISO8601(
    { strict: true },
    {
      groups: [
        ChampionshipCircuitValidationGroup.CREATION,
        ChampionshipCircuitValidationGroup.UPDATE,
      ],
    }
  )
  @IsOptional({ groups: [ChampionshipCircuitValidationGroup.UPDATE] })
  date!: Date;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
