import { Inject, Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../../shared/result/result';
import { ProductRepositoryPort, PRODUCT_REPOSITORY } from '../../domain/ports/product.repository.port';
import { ProductResponseDto } from '../../dtos/product-response.dto';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(): Promise<Result<ProductResponseDto[]>> {
    try {
      const products = await this.productRepository.findAll();
      const dtos = products.map(ProductResponseDto.fromEntity);
      return ok(dtos);
    } catch (error) {
      return fail('Error al obtener los productos');
    }
  }
}