import { BaseEntity, BeforeRemove, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', name: 'created_at', nullable: false, default: new Date() })
  createdAt: Date;

  @BeforeRemove()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
  @Column({ type: 'timestamp', name: 'updated_at', nullable: false, default: new Date() })
  updatedAt: Date;

  @Column({ nullable: false, type: 'boolean', default: false })
  deleted: boolean;
}
