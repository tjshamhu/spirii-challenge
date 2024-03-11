import { Injectable } from '@nestjs/common';
import { TransactionResponse } from './types';

@Injectable()
export class ExternalDataService {
  fetchAllTransactions(): TransactionResponse {
    const data = require('../commons/transaction-list.json');
    return data;
  }
}
