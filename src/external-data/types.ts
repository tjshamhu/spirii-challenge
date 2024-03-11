export type TransactionResponse = {
	items: Transaction[]
}

export type Transaction = {
	id: string;
	userId: string;
	createdAt: Date;
	type: TransactionType;
	amount: number;
}

export enum TransactionType {
	PAYOUT = 'payout',
	SPENT = 'spent',
	EARNED = 'earned'
}