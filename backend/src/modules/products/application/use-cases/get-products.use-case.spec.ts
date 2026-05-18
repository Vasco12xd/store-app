import { GetProductsUseCase } from './get-products.use-case';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ok, fail, Result, Failure } from '../../../../shared/result/result';

const mockProduct = new Product(
  '1', 'Sony WH-1000XM5', 'Descripción', 350000, 10,
  'https://image.url', new Date(), new Date(),
);

const mockRepository: jest.Mocked<ProductRepositoryPort> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStock: jest.fn(),
};

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetProductsUseCase(mockRepository);
  });

  it('should return products successfully', async () => {
    mockRepository.findAll.mockResolvedValue([mockProduct]);

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].name).toBe('Sony WH-1000XM5');
      expect(result.value[0].inStock).toBe(true);
    }
  });

  it('should return empty array when no products', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(0);
    }
  });

  it('should return failure when repository throws', async () => {
    mockRepository.findAll.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect((result as Failure<string>).error).toBe('Error al obtener los productos');
    }
  });

  it('should map product to DTO correctly', async () => {
    mockRepository.findAll.mockResolvedValue([mockProduct]);

    const result = await useCase.execute();

    if (result.ok) {
      const dto = result.value[0];
      expect(dto.id).toBe('1');
      expect(dto.price).toBe(350000);
      expect(dto.stockQuantity).toBe(10);
      expect(dto.inStock).toBe(true);
    }
  });
});