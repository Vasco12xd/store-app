import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProductsModule } from '../products/products.module';
import { TRANSACTION_REPOSITORY } from './domain/ports/transaction.repository.port';
import { TransactionPrismaRepository } from './infrastructure/repositories/transaction.prisma.repository';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { UpdateTransactionUseCase } from './application/use-cases/update-transaction.use-case';
import { TransactionController } from './infrastructure/controllers/transaction.controller';

@Module({
  imports: [ProductsModule],
  controllers: [TransactionController],
  providers: [
    PrismaService,
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionPrismaRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY, UpdateTransactionUseCase],
})
export class TransactionsModule {}