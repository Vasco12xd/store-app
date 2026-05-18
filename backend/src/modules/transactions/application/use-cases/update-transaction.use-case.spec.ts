import { UpdateTransactionUseCase } from './update-transaction.use-case';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { ok, fail, Result, Failure } from '../../../../shared/result/result';

const makeTx = (status: TransactionStatus) => new Transaction(
  'tx-1', 'cust-1', 'prod-1', status,
  350000, 3000, 8000, 361000,
  'REF-ABC', null, '4242', 'VISA', new Date(), new Date(),
);

const mockRepo: jest.Mocked<TransactionRepositoryPort> = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateTransactionUseCase(mockRepo);
  });

  it('should update a PENDING transaction', async () => {
    const updated = makeTx(TransactionStatus.APPROVED);
    mockRepo.findById.mockResolvedValue(makeTx(TransactionStatus.PENDING));
    mockRepo.update.mockResolvedValue(updated);

    const result = await useCase.execute('tx-1', {
      status: TransactionStatus.APPROVED,
      wompiTransactionId: 'wompi-123',
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.status).toBe(TransactionStatus.APPROVED);
  });

  it('should fail when transaction not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-1', { status: TransactionStatus.APPROVED });

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Transacción no encontrada');
  });

  it('should fail when transaction is not PENDING', async () => {
    mockRepo.findById.mockResolvedValue(makeTx(TransactionStatus.APPROVED));

    const result = await useCase.execute('tx-1', { status: TransactionStatus.DECLINED });

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Solo se pueden actualizar transacciones en estado PENDING');
  });
});