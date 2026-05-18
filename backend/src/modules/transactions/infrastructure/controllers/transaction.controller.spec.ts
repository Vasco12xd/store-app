import { TransactionController } from './transaction.controller';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { UpdateTransactionUseCase } from '../../application/use-cases/update-transaction.use-case';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockCreateUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreateTransactionUseCase>;
const mockUpdateUseCase = { execute: jest.fn() } as unknown as jest.Mocked<UpdateTransactionUseCase>;

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TransactionController(mockCreateUseCase, mockUpdateUseCase);
  });

  const createDto = {
    customerId: 'cust-1', productId: 'prod-1',
    productAmount: 350000, baseFee: 3000, deliveryFee: 8000,
    totalAmount: 361000, cardLastFour: '4242', cardBrand: 'VISA',
  };

  it('should create a transaction', async () => {
    const tx = { id: 'tx-1', status: TransactionStatus.PENDING };
    mockCreateUseCase.execute.mockResolvedValue({ ok: true, value: tx } as any);

    const result = await controller.create(createDto);
    expect(result).toEqual(tx);
  });

  it('should throw BadRequestException on create failure', async () => {
    mockCreateUseCase.execute.mockResolvedValue({ ok: false, error: 'Error' });

    await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
  });

  it('should update a transaction', async () => {
    const tx = { id: 'tx-1', status: TransactionStatus.APPROVED };
    mockUpdateUseCase.execute.mockResolvedValue({ ok: true, value: tx } as any);

    const result = await controller.update('tx-1', { status: TransactionStatus.APPROVED });
    expect(result).toEqual(tx);
  });

  it('should throw NotFoundException on update failure', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({ ok: false, error: 'No encontrado' });

    await expect(controller.update('tx-1', { status: TransactionStatus.APPROVED }))
      .rejects.toThrow(NotFoundException);
  });
});