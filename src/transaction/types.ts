export type AggregatedTransactions = {
	userId: string,
	balance: number,
	earned: number,
	spent: number,
	payout: number
}

export type AggregatedPayouts = {
	userId: string,
	totalPayouts: number
}