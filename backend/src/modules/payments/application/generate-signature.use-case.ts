import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Result, ok, fail } from '../../../shared/result/result';
import { TransactionRepositoryPort, TRANSACTION_REPOSITORY } from '../../transactions/domain/ports/transaction.repository.port';

export interface SignatureResult {
  reference: string;
  amountInCents: number;
  currency: string;
  signature: string;
  publicKey: string;
}

@Injectable()
export class GenerateSignatureUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
  ) {}

  async execute(transactionId: string): Promise<Result<SignatureResult>> {
    try {
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) return fail('Transacción no encontrada');

      const amountInCents = Math.round(transaction.totalAmount * 100);
      const integrityKey = process.env.WOMPI_INTEGRITY_KEY || '';
      const str = `${transaction.paymentReference}${amountInCents}COP${integrityKey}`;
      const signature = crypto.createHash('sha256').update(str).digest('hex');

      return ok({
        reference: transaction.paymentReference,
        amountInCents,
        currency: 'COP',
        signature,
        publicKey: process.env.WOMPI_PUBLIC_KEY || '',
      });
    } catch (error) {
      return fail('Error al generar la firma');
    }
  }
}