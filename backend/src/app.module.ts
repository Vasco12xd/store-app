import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [ProductsModule, CustomersModule, TransactionsModule, DeliveriesModule, PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 