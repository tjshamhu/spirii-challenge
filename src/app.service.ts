import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregationEntity } from './data/entities/aggregation.entity';
import { LogEntity } from './data/entities/log.entity';
import { ExternalDataService } from './external-data/external-data.service';
import { TransactionType } from './external-data/types';
import { AggregatedTransactions } from './aggregation/types';

@Injectable()
export class AppService {
  private lastSyncDate = Date.now();

  constructor(
    private readonly externalDataService: ExternalDataService,
    @InjectRepository(AggregationEntity)
    private aggregationEntityRepository: Repository<AggregationEntity>,
    @InjectRepository(LogEntity)
    private logEntityRepository: Repository<LogEntity>,
  ) {}

  getHealth(): string {
    return 'I am alive!';
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncTransactionData() {
    console.log('<<<<<< SYNCING DATA >>>>>');

    // TODO add last sync date
    const newTransactions = this.externalDataService.fetchAllTransactions();

    console.log(
      `<<<<<< FETCHED ${newTransactions.items.length} nee transactions >>>>>`,
    );

    const aggregatedTransactionMap: {
      [userId: string]: AggregatedTransactions;
    } = {};

    for (const transaction of newTransactions.items) {
      const hasBeenProcessed = await this.logEntityRepository.exists({
        where: { transactionId: transaction.id },
      });
      if (hasBeenProcessed) {
        console.log(
          `<<<<<< SKIPPING TRANSACTION ${transaction.id} AS IT WAS PROCESSED ALREADY >>>>>`,
        );
      }

      const userId = transaction.userId;
      aggregatedTransactionMap[userId] =
        aggregatedTransactionMap[userId] ||
        ({
          userId,
          balance: 0,
          earned: 0,
          spent: 0,
          payout: 0,
        } as AggregatedTransactions);

      switch (transaction.type) {
        case TransactionType.EARNED:
          aggregatedTransactionMap[userId].earned += transaction.amount;
          aggregatedTransactionMap[userId].balance += transaction.amount;
          break;
        case TransactionType.SPENT:
          aggregatedTransactionMap[userId].spent += transaction.amount;
          aggregatedTransactionMap[userId].balance -= transaction.amount;
          break;
        case TransactionType.PAYOUT:
          aggregatedTransactionMap[userId].payout += transaction.amount;
          aggregatedTransactionMap[userId].balance -= transaction.amount;
          break;
      }

      await this.logEntityRepository.insert({ transactionId: transaction.id });
    }

    Object.values(aggregatedTransactionMap).map(async (it) => {
      const userId = it.userId;
      const aggregation = await this.aggregationEntityRepository.findOne({
        where: { userId },
      });
      console.log(`<<<<<< UPSERTING AGGREGATIONS FOR userId ${userId} >>>>>`);

      if (aggregation) {
        await this.aggregationEntityRepository.update(
          { userId: aggregation.userId },
          {
            balance: aggregation.balance + it.balance,
            earned: aggregation.earned + it.earned,
            spent: aggregation.spent + it.spent,
            payout: aggregation.payout + it.payout,
          },
        );
      } else {
        await this.aggregationEntityRepository.insert({
          userId,
          balance: it.balance,
          earned: it.earned,
          spent: it.spent,
          payout: it.payout,
        });
      }
    });
  }
}
