/* eslint-disable camelcase */
import { Entity, OneToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmpty, IsString, Length } from 'class-validator';
import config from '@app/config';
import User from './User';

@Entity('user_password_reset')
export default class UserPasswordReset {
  @OneToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @IsEmpty({ always: true })
  user!: User;

  @Column({ name: 'token', length: config.SECURITY.TOKEN.PASSWORD.LENGTH })
  @IsString()
  @Length(config.SECURITY.TOKEN.PASSWORD.LENGTH, config.SECURITY.TOKEN.PASSWORD.LENGTH)
  token!: string;

  @Column({ name: 'used' })
  @IsEmpty({ always: true })
  used!: boolean;

  @IsString()
  @Length(8, 64)
  password!: string;

  @CreateDateColumn({ name: 'created_at', select: false, update: false })
  @IsEmpty({ always: true })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @IsEmpty({ always: true })
  updated_at!: Date;
}
