import { Inject, Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../../shared/result/result';
import { TransactionRepositoryPort, TRANSACTION_REPOSITORY } from '../../domain/ports/transaction.repository.port';
import { UpdateTransactionDto } from '../../dto/update-transaction.dto';
import { TransactionResponseDto } from '../../dto/transaction-response.dto';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateTransactionDto): Promise<Result<TransactionResponseDto>> {
    try {
      const transaction = await this.transactionRepository.findById(id);

      if (!transaction) {
        return fail('Transacción no encontrada');
      }

      if (!transaction.isPending()) {
        return fail('Solo se pueden actualizar transacciones en estado PENDING');
      }

      const updated = await this.transactionRepository.update(id, dto);
      return ok(TransactionResponseDto.fromEntity(updated));
    } catch (error) {
      return fail('Error al actualizar la transacción');
    }
  }
}