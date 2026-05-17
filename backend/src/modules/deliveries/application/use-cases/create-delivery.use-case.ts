import { Inject, Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../../shared/result/result';
import { DeliveryRepositoryPort, DELIVERY_REPOSITORY } from '../../domain/ports/delivery.repository.port';
import { TransactionRepositoryPort, TRANSACTION_REPOSITORY } from '../../../transactions/domain/ports/transaction.repository.port';
import { ProductRepositoryPort, PRODUCT_REPOSITORY } from '../../../products/domain/ports/product.repository.port';
import { CustomerRepositoryPort, CUSTOMER_REPOSITORY } from '../../../customers/domain/ports/customer.repository.port';
import { DeliveryResponseDto } from '../../dto/delivery-response.dto';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(transactionId: string): Promise<Result<DeliveryResponseDto>> {
    try {
      const transaction = await this.transactionRepository.findById(transactionId);

      if (!transaction) {
        return fail('Transacción no encontrada');
      }

      if (!transaction.isApproved()) {
        return fail('Solo se puede crear entrega para transacciones aprobadas');
      }

      const existingDelivery = await this.deliveryRepository.findByTransactionId(transactionId);
      if (existingDelivery) {
        return fail('Ya existe una entrega para esta transacción');
      }

      const customer = await this.customerRepository.findById(transaction.customerId);
      if (!customer) {
        return fail('Cliente no encontrado');
      }

      const product = await this.productRepository.findById(transaction.productId);
      if (!product) {
        return fail('Producto no encontrado');
      }

      await this.productRepository.updateStock(
        transaction.productId,
        product.stockQuantity - 1,
      );

      const delivery = await this.deliveryRepository.create({
        transactionId,
        customerId: transaction.customerId,
        productId: transaction.productId,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode,
      });

      return ok(DeliveryResponseDto.fromEntity(delivery));
    } catch (error) {
      return fail('Error al crear la entrega');
    }
  }
}