import { VerifyPaymentUseCase } from './verify-payment.use-case';
import { Transaction, TransactionStatus } from '../../transactions/domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../transactions/domain/ports/transaction.repository.port';
import { CreateDeliveryUseCase } from '../../deliveries/application/use-cases/create-delivery.use-case';
import { DeliveryStatus } from '../../deliveries/domain/entities/delivery.entity';
import { ok, fail, Result, Failure } from '../../../shared/result/result';

const mockPendingTx = new Transaction(
  'tx-1', 'cust-1', 'prod-1', TransactionStatus.PENDING,
  350000, 3000, 8000, 361000,
  'REF-ABC', null, '4242', 'VISA', new Date(), new Date(),
);

const mockApprovedTx = new Transaction(
  'tx-1', 'cust-1', 'prod-1', TransactionStatus.APPROVED,
  350000, 3000, 8000, 361000,
  'REF-ABC', 'wompi-123', '4242', 'VISA', new Date(), new Date(),
);

const mockTransactionRepo: jest.Mocked<TransactionRepositoryPort> = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

const mockCreateDelivery = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateDeliveryUseCase>;

describe('VerifyPaymentUseCase', () => {
  let useCase: VerifyPaymentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WOMPI_API_URL = 'https://api.test.wompi.dev/v1';
    useCase = new VerifyPaymentUseCase(mockTransactionRepo, mockCreateDelivery);
  });

  it('should approve transaction with simulated ID', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockPendingTx);
    mockTransactionRepo.update.mockResolvedValue(mockApprovedTx);
    mockCreateDelivery.execute.mockResolvedValue({
      ok: true,
      value: {
        id: 'del-1', transactionId: 'tx-1', customerId: 'cust-1',
        productId: 'prod-1', status: DeliveryStatus.ASSIGNED,
        address: 'Calle 1', city: 'Bogotá', zipCode: '110111',
        assignedAt: new Date(),
      },
    });

    const result = await useCase.execute('tx-1', 'sim_1234567890');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(TransactionStatus.APPROVED);
      expect(result.value.deliveryId).toBe('del-1');
    }
  });

  it('should fail when transaction not found', async () => {
    mockTransactionRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-1', 'sim_123');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Transacción no encontrada');
  });

  it('should fail when transaction already processed', async () => {
    mockTransactionRepo.findById.mockResolvedValue(mockApprovedTx);

    const result = await useCase.execute('tx-1', 'sim_123');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Transacción ya procesada');
  });

  it('should not create delivery for declined transaction', async () => {
    const declinedTx = new Transaction(
      'tx-1', 'cust-1', 'prod-1', TransactionStatus.DECLINED,
      350000, 3000, 8000, 361000,
      'REF-ABC', null, '4242', 'VISA', new Date(), new Date(),
    );
    mockTransactionRepo.findById.mockResolvedValue(mockPendingTx);
    mockTransactionRepo.update.mockResolvedValue(declinedTx);

    await useCase.execute('tx-1', 'sim_declined');

    expect(mockCreateDelivery.execute).not.toHaveBeenCalled();
  });
});