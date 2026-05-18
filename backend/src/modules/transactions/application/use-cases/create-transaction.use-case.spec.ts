import { CreateTransactionUseCase } from './create-transaction.use-case';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { ProductRepositoryPort } from '../../../products/domain/ports/product.repository.port';
import { Product } from '../../../products/domain/entities/product.entity';
import { ok, fail, Result, Failure } from '../../../../shared/result/result';

const mockProduct = new Product(
  'prod-1', 'Sony WH-1000XM5', 'Desc', 350000, 10,
  null, new Date(), new Date(),
);

const mockTransaction = new Transaction(
  'tx-1', 'cust-1', 'prod-1', TransactionStatus.PENDING,
  350000, 3000, 8000, 361000,
  'REF-ABC123', null, '4242', 'VISA', new Date(), new Date(),
);

const mockTransactionRepo: jest.Mocked<TransactionRepositoryPort> = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

const mockProductRepo: jest.Mocked<ProductRepositoryPort> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  updateStock: jest.fn(),
};

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTransactionUseCase(mockTransactionRepo, mockProductRepo);
  });

  const validDto = {
    customerId: 'cust-1',
    productId: 'prod-1',
    productAmount: 350000,
    baseFee: 3000,
    deliveryFee: 8000,
    totalAmount: 361000,
    cardLastFour: '4242',
    cardBrand: 'VISA',
  };

  it('should create a transaction successfully', async () => {
    mockProductRepo.findById.mockResolvedValue(mockProduct);
    mockTransactionRepo.create.mockResolvedValue(mockTransaction);

    const result = await useCase.execute(validDto);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(TransactionStatus.PENDING);
      expect(result.value.cardBrand).toBe('VISA');
    }
  });

  it('should fail when product not found', async () => {
    mockProductRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(validDto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Producto no encontrado');
  });

  it('should fail when product has no stock', async () => {
    const outOfStock = new Product(
      'prod-1', 'Sony', 'Desc', 350000, 0, null, new Date(), new Date(),
    );
    mockProductRepo.findById.mockResolvedValue(outOfStock);

    const result = await useCase.execute(validDto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('El producto no tiene stock disponible');
  });

  it('should generate a payment reference', async () => {
    mockProductRepo.findById.mockResolvedValue(mockProduct);
    mockTransactionRepo.create.mockResolvedValue(mockTransaction);

    await useCase.execute(validDto);

    expect(mockTransactionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentReference: expect.stringMatching(/^REF-/),
      }),
    );
  });
});