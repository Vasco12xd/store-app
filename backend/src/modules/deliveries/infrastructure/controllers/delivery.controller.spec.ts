import { DeliveryController } from './delivery.controller';
import { CreateDeliveryUseCase } from '../../application/use-cases/create-delivery.use-case';
import { BadRequestException } from '@nestjs/common';
import { DeliveryStatus } from '../../domain/entities/delivery.entity';

const mockUseCase = { execute: jest.fn() } as unknown as jest.Mocked<CreateDeliveryUseCase>;

describe('DeliveryController', () => {
  let controller: DeliveryController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DeliveryController(mockUseCase);
  });

  it('should create a delivery', async () => {
    const delivery = {
      id: 'del-1', transactionId: 'tx-1', status: DeliveryStatus.ASSIGNED,
    };
    mockUseCase.execute.mockResolvedValue({ ok: true, value: delivery } as any);

    const result = await controller.create('tx-1');
    expect(result).toEqual(delivery);
    expect(mockUseCase.execute).toHaveBeenCalledWith('tx-1');
  });

  it('should throw BadRequestException when use case fails', async () => {
    mockUseCase.execute.mockResolvedValue({ ok: false, error: 'Transacción no encontrada' });

    await expect(controller.create('tx-1')).rejects.toThrow(BadRequestException);
  });
});