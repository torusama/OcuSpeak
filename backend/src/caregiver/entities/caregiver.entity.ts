import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { ChildProfile } from '../../child/entities/child.entity';

export enum CaregiverRole {
  PARENT = 'PARENT',
  GUARDIAN = 'GUARDIAN',
  CARE_STAFF = 'CARE_STAFF',
}

@Entity('caregivers')
export class Caregiver extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: CaregiverRole, default: CaregiverRole.PARENT })
  role: CaregiverRole;

  @Column({ nullable: true })
  fcmToken: string;

  @OneToMany(() => ChildProfile, (child) => child.caregiver)
  children: ChildProfile[];
}
