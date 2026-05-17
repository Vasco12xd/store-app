import { Inject, Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../../shared/result/result';
import { TransactionRepositoryPort, TRANSACTION_REPOSITORY } from '../../domain/ports/transaction.repository.port';
import { ProductRepositoryPort, PRODUCT_REPOSITORY } from '../../../products/domain/ports/product.repository.port';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { TransactionResponseDto } from '../../dto/transaction-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Result<TransactionResponseDto>> {
    try {
      const product = await this.productRepository.findById(dto.productId);

      if (!product) {
        return fail('Producto no encontrado');
      }

      if (!product.hasStock()) {
        return fail('El producto no tiene stock disponible');
      }

      const paymentReference = `REF-${uuidv4().split('-')[0].toUpperCase()}`;

      const transaction = await this.transactionRepository.create({
        ...dto,
        paymentReference,
      });

      return ok(TransactionResponseDto.fromEntity(transaction));
    } catch (error) {
      return fail('Error al crear la transacción');
    }
  }
}