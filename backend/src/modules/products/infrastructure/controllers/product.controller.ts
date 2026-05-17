import { Controller, Get, NotFoundException } from '@nestjs/common';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { Failure } from '../../../../shared/result/result';
import { ProductResponseDto } from '../../dtos/product-response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  async findAll() {
    const result = await this.getProductsUseCase.execute();

    if (result.ok === false) {
      throw new NotFoundException((result as Failure<string>).error);
    }

    return result.value;
  }
}