import { Entity, Column, ManyToOne } from 'typeorm';

import bcrypt from 'bcryptjs';
import { CommonEntity } from './common';
import { User } from './User';

@Entity()
export class Upload extends CommonEntity {
  constructor() {
    super();
  }

  @Column({ nullable: false, length: 100, type: 'varchar' })
  name: string;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  path: string;

  @Column({ nullable: true, length: 512, type: 'varchar' })
  about: string;

  @ManyToOne(() => User, (us) => us.uploads)
  user: User;
}
