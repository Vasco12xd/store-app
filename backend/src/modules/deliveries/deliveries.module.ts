import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { DELIVERY_REPOSITORY } from './domain/ports/delivery.repository.port';
import { DeliveryPrismaRepository } from './infrastructure/repositories/delivery.prisma.repository';
import { CreateDeliveryUseCase } from './application/use-cases/create-delivery.use-case';
import { DeliveryController } from './infrastructure/controllers/delivery.controller';

@Module({
  imports: [ProductsModule, CustomersModule, TransactionsModule],
  controllers: [DeliveryController],
  providers: [
    PrismaService,
    CreateDeliveryUseCase,
    {
      provide: DELIVERY_REPOSITORY,
      useClass: DeliveryPrismaRepository,
    },
  ],
  exports: [DELIVERY_REPOSITORY, CreateDeliveryUseCase],
})
export class DeliveriesModule {}