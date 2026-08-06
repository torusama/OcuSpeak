import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ChildProfile } from './child-profile.entity';

@Entity('caregivers')
export class Caregiver extends BaseEntity {

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @OneToMany(() => ChildProfile, child => child.caregiver)
  children: ChildProfile[];
}