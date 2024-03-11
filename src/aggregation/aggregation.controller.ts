import { Controller, Get, Param } from '@nestjs/common';
import { Transaction } from '../external-data/types';
import { AggregationService } from './aggregation.service';
import { AggregatedPayouts, AggregatedTransactions } from './types';

@Controller('aggregation')
export class AggregationController {
  constructor(private readonly transactionService: AggregationService) {}

  @Get()
  getAll(): Transaction[] {
    return this.transactionService.getAll();
  }

  @Get('/payouts')
  async getListOfRequestedPayouts(): Promise<AggregatedPayouts[]> {
    return this.transactionService.getListOfRequestedPayouts();
  }

  @Get('/:userId')
  getAggregatedDataByUserId(
    @Param('userId') userId: string,
  ): Promise<AggregatedTransactions> {
    return this.transactionService.getAggregatedDataByUserId(userId);
  }
}
