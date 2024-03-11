import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { to2sigFigures } from '../commons/functions';
import { AggregationEntity } from '../data/entities/aggregation.entity';
import { ExternalDataService } from '../external-data/external-data.service';
import { Transaction, TransactionType } from '../external-data/types';
import { AggregatedPayouts, AggregatedTransactions } from './types';

@Injectable()
export class AggregationService {
  constructor(
    private readonly externalDataService: ExternalDataService,
    @InjectRepository(AggregationEntity)
    private aggregationEntityRepository: Repository<AggregationEntity>,
  ) {}

  getAll(): Transaction[] {
    const response = this.externalDataService.fetchAllTransactions();
    return Array(100).fill(response.items).flat();
  }

  /** DEPRECATED */
  _getAggregatedDataByUserId(userId: string): AggregatedTransactions {
    const transactions = this.getAll()
      .filter((it) => it.userId === userId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const userExists = transactions.find((it) => it.userId == userId);
    if (!userExists) {
      throw new NotFoundException('UserId does not exist');
    }

    let balance = 0;
    let earned = 0;
    let spent = 0;
    let payout = 0;

    transactions.forEach((transaction) => {
      switch (transaction.type) {
        case TransactionType.EARNED:
          earned += transaction.amount;
          balance += transaction.amount;
          break;
        case TransactionType.SPENT:
          spent += transaction.amount;
          balance -= transaction.amount;
          break;
        case TransactionType.PAYOUT:
          payout += transaction.amount;
          balance -= transaction.amount;
          break;
      }
    });

    return {
      userId,
      balance: to2sigFigures(balance),
      earned: to2sigFigures(earned),
      spent: to2sigFigures(spent),
      payout: to2sigFigures(payout),
    };
  }

  /** DEPRECATED */
  _getListOfRequestedPayouts(): AggregatedPayouts[] {
    const payouts = this.getAll().filter(
      (it) => it.type == TransactionType.PAYOUT,
    );

    const payoutsMap = new Map<string, number>();

    payouts.forEach((transaction) => {
      const userId = transaction.userId;
      payoutsMap[userId] = payoutsMap[userId] || 0;
      payoutsMap[userId] += transaction.amount;
    });

    const aggPayouts = Object.entries(payoutsMap).map(([userId, amount]) => ({
      userId,
      totalPayouts: amount,
    }));

    return aggPayouts;
  }

  async getAggregatedDataByUserId(
    userId: string,
  ): Promise<AggregatedTransactions> {
    const aggregations = await this.aggregationEntityRepository.findOne({
      where: { userId },
    });
    if (!aggregations) {
      throw new NotFoundException('UserId does not exist');
    }
    return aggregations;
  }

  async getListOfRequestedPayouts(): Promise<AggregatedPayouts[]> {
    const aggregations = await this.aggregationEntityRepository.find();

    const payoutsMap = new Map<string, number>();

    aggregations.forEach((transaction) => {
      const userId = transaction.userId;
      payoutsMap[userId] = payoutsMap[userId] || 0;
      payoutsMap[userId] += transaction.payout;
    });

    const aggPayouts = Object.entries(payoutsMap).map(([userId, amount]) => ({
      userId,
      totalPayouts: amount,
    }));

    return aggPayouts;
  }
}
