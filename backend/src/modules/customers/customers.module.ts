import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CUSTOMER_REPOSITORY } from './domain/ports/customer.repository.port';
import { CustomerPrismaRepository } from './infrastructure/repositories/customer.prisma.repository';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { CustomerController } from './infrastructure/controllers/customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [
    PrismaService,
    CreateCustomerUseCase,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerPrismaRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY, CreateCustomerUseCase],
})
export class CustomersModule {}