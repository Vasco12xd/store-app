import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [ProductsModule, CustomersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}