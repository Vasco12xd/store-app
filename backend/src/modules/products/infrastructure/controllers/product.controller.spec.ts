import { ProductController } from './product.controller';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { NotFoundException } from '@nestjs/common';

const mockUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetProductsUseCase>;

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProductController(mockUseCase);
  });

  it('should return products', async () => {
    const products = [{ id: '1', name: 'Sony', price: 350000, description: 'A great product', stockQuantity: 10, imageUrl: 'http://example.com/image.jpg', inStock: true }];
    mockUseCase.execute.mockResolvedValue({ ok: true, value: products });

    const result = await controller.findAll();
    expect(result).toEqual(products);
  });

  it('should throw NotFoundException when use case fails', async () => {
    mockUseCase.execute.mockResolvedValue({ ok: false, error: 'Error al obtener los productos' });

    await expect(controller.findAll()).rejects.toThrow(NotFoundException);
  });
});