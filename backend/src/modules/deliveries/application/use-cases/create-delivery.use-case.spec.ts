import { CreateDeliveryUseCase } from './create-delivery.use-case';
import { DeliveryRepositoryPort } from '../../domain/ports/delivery.repository.port';
import { TransactionRepositoryPort } from '../../../transactions/domain/ports/transaction.repository.port';
import { ProductRepositoryPort } from '../../../products/domain/ports/product.repository.port';
import { CustomerRepositoryPort } from '../../../customers/domain/ports/customer.repository.port';
import { Transaction, TransactionStatus } from '../../../transactions/domain/entities/transaction.entity';
import { Product } from '../../../products/domain/entities/product.entity';
import { Customer } from '../../../customers/domain/entities/customer.entity';
import { Delivery, DeliveryStatus } from '../../domain/entities/delivery.entity';
import { ok, fail, Result, Failure } from '../../../../shared/result/result';

const mockTransaction = new Transaction(
  'tx-1', 'cust-1', 'prod-1', TransactionStatus.APPROVED,
  350000, 3000, 8000, 361000,
  'REF-ABC', 'wompi-123', '4242', 'VISA', new Date(), new Date(),
);

const mockPendingTransaction = new Transaction(
  'tx-2', 'cust-1', 'prod-1', TransactionStatus.PENDING,
  350000, 3000, 8000, 361000,
  'REF-DEF', null, '4242', 'VISA', new Date(), new Date(),
);

const mockProduct = new Product(
  'prod-1', 'Sony', 'Desc', 350000, 10, null, new Date(), new Date(),
);

const mockCustomer = new Customer(
  'cust-1', 'Juan', 'juan@test.com', '300', 'Calle 1', 'Bogotá', '110111', new Date(),
);

const mockDelivery = new Delivery(
  'del-1', 'tx-1', 'cust-1', 'prod-1', DeliveryStatus.ASSIGNED,
  'Calle 1', 'Bogotá', '110111', new Date(), new Date(),
);

const mockDeliveryRepo: jest.Mocked<DeliveryRepositoryPort> = {
  create: jest.fn(),
  findByTransactionId: jest.fn(),
};

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

const mockCustomerRepo: jest.Mocked<CustomerRepositoryPort> = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe('CreateDeliveryUseCase', () => {
  let useCase: CreateDeliveryUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateDeliveryUseCase(
      mockDeliveryRepo,
      mockTransactionRepo,
      mockProductRepo,
      mockCustomerRepo,
    );
  });

  it('should create delivery successfully for approved transaction', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockTransaction);
    mockDeliveryRepo.findByTransactionId.mockResolvedValue(null);
    mockCustomerRepo.findById.mockResolvedValue(mockCustomer);
    mockProductRepo.findById.mockResolvedValue(mockProduct);
    mockProductRepo.updateStock.mockResolvedValue(mockProduct);
    mockDeliveryRepo.create.mockResolvedValue(mockDelivery);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(DeliveryStatus.ASSIGNED);
      expect(result.value.transactionId).toBe('tx-1');
    }
  });

  it('should fail when transaction not found', async () => {
    mockTransactionRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Transacción no encontrada');
  });

  it('should fail when transaction is not approved', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockPendingTransaction);

    const result = await useCase.execute('tx-2');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Solo se puede crear entrega para transacciones aprobadas');
  });

  it('should fail when delivery already exists', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockTransaction);
    mockDeliveryRepo.findByTransactionId.mockResolvedValue(mockDelivery);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Ya existe una entrega para esta transacción');
  });

  it('should update product stock after delivery', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockTransaction);
    mockDeliveryRepo.findByTransactionId.mockResolvedValue(null);
    mockCustomerRepo.findById.mockResolvedValue(mockCustomer);
    mockProductRepo.findById.mockResolvedValue(mockProduct);
    mockProductRepo.updateStock.mockResolvedValue(mockProduct);
    mockDeliveryRepo.create.mockResolvedValue(mockDelivery);

    await useCase.execute('tx-1');

    expect(mockProductRepo.updateStock).toHaveBeenCalledWith('prod-1', 9);
  });

  it('should fail when customer not found', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockTransaction);
    mockDeliveryRepo.findByTransactionId.mockResolvedValue(null);
    mockCustomerRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Cliente no encontrado');
  });
});