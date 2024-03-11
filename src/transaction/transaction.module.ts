import { Module } from '@nestjs/common';
import {ExternalDataModule} from '../external-data/external-data.module'
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [ExternalDataModule]
})
export class TransactionModule {}
