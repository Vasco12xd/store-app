import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [ProductsModule, CustomersModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 