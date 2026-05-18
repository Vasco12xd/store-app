import { GenerateSignatureUseCase } from './generate-signature.use-case';
import { Transaction, TransactionStatus } from '../../transactions/domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../transactions/domain/ports/transaction.repository.port';
import { ok, fail, Result, Failure } from '../../../shared/result/result';

const mockTx = new Transaction(
  'tx-1', 'cust-1', 'prod-1', TransactionStatus.PENDING,
  350000, 3000, 8000, 361000,
  'REF-ABC123', null, '4242', 'VISA', new Date(), new Date(),
);

const mockRepo: jest.Mocked<TransactionRepositoryPort> = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('GenerateSignatureUseCase', () => {
  let useCase: GenerateSignatureUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WOMPI_INTEGRITY_KEY = 'test_integrity_key';
    process.env.WOMPI_PUBLIC_KEY = 'pub_test_key';
    useCase = new GenerateSignatureUseCase(mockRepo);
  });

  it('should generate signature successfully', async () => {
    mockRepo.findById.mockResolvedValue(mockTx);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.reference).toBe('REF-ABC123');
      expect(result.value.signature).toHaveLength(64);
      expect(result.value.currency).toBe('COP');
    }
  });

  it('should fail when transaction not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as Failure<string>).error).toBe('Transacción no encontrada');
  });

  it('should calculate amount in cents correctly', async () => {
    mockRepo.findById.mockResolvedValue(mockTx);

    const result = await useCase.execute('tx-1');

    if (result.ok) {
      expect(result.value.amountInCents).toBe(36100000);
    }
  });
});