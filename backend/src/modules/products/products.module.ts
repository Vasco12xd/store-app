import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PRODUCT_REPOSITORY } from './domain/ports/product.repository.port';
import { ProductPrismaRepository } from './infrastructure/repositories/product.prisma.repository';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { ProductController } from './infrastructure/controllers/product.controller';

@Module({
  controllers: [ProductController],
  providers: [
    PrismaService,
    GetProductsUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}