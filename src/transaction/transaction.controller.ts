import {Controller, Get, Param} from '@nestjs/common'
import {Transaction} from '../external-data/types'
import {TransactionService} from './transaction.service'
import {AggregatedTransactions} from './types'

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Get()
	getAll(): Transaction[] {
		return this.transactionService.getAll();
	}

	@Get('/payouts')
	async getListOfRequestedPayouts(): Promise<any> {
		return this.transactionService.getListOfRequestedPayouts();
	}

	@Get('/:userId')
	getAggregatedDataByUserId(@Param('userId') userId: string): AggregatedTransactions {
		return this.transactionService.getAggregatedDataByUserId(userId);
	}


}
