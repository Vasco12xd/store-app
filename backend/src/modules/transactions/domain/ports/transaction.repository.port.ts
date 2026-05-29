import { Transaction, TransactionStatus } from '../entities/transaction.entity';

export interface CreateTransactionData {
  customerId: string;
  productId: string;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  paymentReference: string;
  cardLastFour: string;
  cardBrand: string;
  vatAmount?: number;
}

export interface UpdateTransactionData {
  status: TransactionStatus;
  wompiTransactionId?: string;
}

export interface TransactionRepositoryPort {
  create(data: CreateTransactionData): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  update(id: string, data: UpdateTransactionData): Promise<Transaction>;
}

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';