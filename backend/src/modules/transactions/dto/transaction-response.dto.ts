import { Transaction } from '../domain/entities/transaction.entity';

export class TransactionResponseDto {
  id: string;
  customerId: string;
  productId: string;
  status: string;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  paymentReference: string;
  wompiTransactionId: string | null;
  cardLastFour: string;
  cardBrand: string;
  createdAt: Date;

  static fromEntity(transaction: Transaction): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.id = transaction.id;
    dto.customerId = transaction.customerId;
    dto.productId = transaction.productId;
    dto.status = transaction.status;
    dto.productAmount = transaction.productAmount;
    dto.baseFee = transaction.baseFee;
    dto.deliveryFee = transaction.deliveryFee;
    dto.totalAmount = transaction.totalAmount;
    dto.paymentReference = transaction.paymentReference;
    dto.wompiTransactionId = transaction.wompiTransactionId;
    dto.cardLastFour = transaction.cardLastFour;
    dto.cardBrand = transaction.cardBrand;
    dto.createdAt = transaction.createdAt;
    return dto;
  }
}