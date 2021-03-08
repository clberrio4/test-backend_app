import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import bcrypt from 'bcryptjs';
import { CommonEntity } from './common';
import { Upload } from './upload';

@Entity()
export class User extends CommonEntity {
  constructor() {
    super();
  }

  @Column({ nullable: false, length: 100, type: 'varchar' })
  name: string;

  @Column({ unique: true, nullable: false, length: 100, type: 'varchar' })
  email: string;

  @Column({ nullable: true, length: 512, type: 'varchar' })
  password: string;

  @OneToMany(() => Upload, (up) => up.user, {
    cascade: true,
    eager: true,
  })
  uploads: Upload[];

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
