import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { TransactionRepositoryPort, CreateTransactionData, UpdateTransactionData } from '../../domain/ports/transaction.repository.port';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';

@Injectable()
export class TransactionPrismaRepository implements TransactionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({ data });
    return this.toDomain(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    return transaction ? this.toDomain(transaction) : null;
  }

  async update(id: string, data: UpdateTransactionData): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data,
    });
    return this.toDomain(transaction);
  }

  private toDomain(raw: any): Transaction {
    return new Transaction(
      raw.id,
      raw.customerId,
      raw.productId,
      raw.status as TransactionStatus,
      Number(raw.productAmount),
      Number(raw.baseFee),
      Number(raw.deliveryFee),
      Number(raw.totalAmount),
      raw.paymentReference,
      raw.wompiTransactionId,
      raw.cardLastFour,
      raw.cardBrand,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}