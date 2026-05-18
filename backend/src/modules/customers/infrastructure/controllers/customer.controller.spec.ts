import { CustomerController } from './customer.controller';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { BadRequestException } from '@nestjs/common';

const mockUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateCustomerUseCase>;

describe('CustomerController', () => {
  let controller: CustomerController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CustomerController(mockUseCase);
  });

  const dto = {
    fullName: 'Juan', email: 'juan@test.com', phone: '3001234567',
    address: 'Calle 1', city: 'Bogotá', zipCode: '110111',
  };

  it('should create a customer', async () => {
    const customer = { id: '1', ...dto };
    mockUseCase.execute.mockResolvedValue({ ok: true, value: customer });

    const result = await controller.create(dto);
    expect(result).toEqual(customer);
  });

  it('should throw BadRequestException when use case fails', async () => {
    mockUseCase.execute.mockResolvedValue({ ok: false, error: 'Error al crear el cliente' });

    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });
});