import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Result, ok, fail } from '../../../shared/result/result';
import { TransactionRepositoryPort, TRANSACTION_REPOSITORY } from '../../transactions/domain/ports/transaction.repository.port';
import { TransactionStatus } from '../../transactions/domain/entities/transaction.entity';
import { CreateDeliveryUseCase } from '../../deliveries/application/use-cases/create-delivery.use-case';

export interface VerifyPaymentResult {
  transactionId: string;
  status: string;
  deliveryId?: string;
}

@Injectable()
export class VerifyPaymentUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
  ) {}

  async execute(transactionId: string, wompiTransactionId: string): Promise<Result<VerifyPaymentResult>> {
    try {
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) return fail('Transacción no encontrada');
      if (!transaction.isPending()) return fail('Transacción ya procesada');

      const wompiStatus = await this.getWompiStatus(wompiTransactionId);
      const finalStatus = this.mapStatus(wompiStatus);

      await this.transactionRepository.update(transactionId, {
        status: finalStatus,
        wompiTransactionId,
      });

      let deliveryId: string | undefined;
      if (finalStatus === TransactionStatus.APPROVED) {
        const deliveryResult = await this.createDeliveryUseCase.execute(transactionId);
        if (deliveryResult.ok) deliveryId = deliveryResult.value.id;
      }

      return ok({ transactionId, status: finalStatus, deliveryId });
    } catch (error: any) {
      return fail('Error al verificar el pago');
    }
  }

  private async getWompiStatus(wompiId: string): Promise<string> {
    const response = await axios.get(
      `${process.env.WOMPI_API_URL}/transactions/${wompiId}`,
    );
    return response.data.data.status;
  }

  private mapStatus(wompiStatus: string): TransactionStatus {
    const map: Record<string, TransactionStatus> = {
      APPROVED: TransactionStatus.APPROVED,
      DECLINED: TransactionStatus.DECLINED,
      VOIDED: TransactionStatus.DECLINED,
      ERROR: TransactionStatus.ERROR,
    };
    return map[wompiStatus] ?? TransactionStatus.ERROR;
  }
}