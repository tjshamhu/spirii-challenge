import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Log')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  transactionId: string;
}
