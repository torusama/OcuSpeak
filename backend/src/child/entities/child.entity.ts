import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Caregiver } from '../../caregiver/entities/caregiver.entity';

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({
    type: 'date',
  })
  birthday: Date;

  @Column()
  gender: string;

  @Column({
    nullable: true,
  })
  diagnosis: string;

  @Column({
    default: 'vi',
  })
  language: string;

  @ManyToOne(
    () => Caregiver,
    caregiver => caregiver.children,
    {
      onDelete: 'CASCADE',
    },
  )
  caregiver: Caregiver;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}