import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Aggregation')
export class AggregationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'float', nullable: true, default: 0 })
  balance: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  earned: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  spent: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  payout: number;
}
