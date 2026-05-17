export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly productId: string,
    public readonly status: TransactionStatus,
    public readonly productAmount: number,
    public readonly baseFee: number,
    public readonly deliveryFee: number,
    public readonly totalAmount: number,
    public readonly paymentReference: string,
    public readonly wompiTransactionId: string | null,
    public readonly cardLastFour: string,
    public readonly cardBrand: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isApproved(): boolean {
    return this.status === TransactionStatus.APPROVED;
  }

  isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }
}