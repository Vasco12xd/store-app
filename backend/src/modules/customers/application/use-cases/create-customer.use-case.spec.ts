import { CreateCustomerUseCase } from './create-customer.use-case';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';
import { ok, fail, Result, Failure } from '../../../../shared/result/result';

const mockCustomer = new Customer(
  '1', 'Juan Pérez', 'juan@test.com',
  '3001234567', 'Calle 123', 'Bogotá', '110111', new Date(),
);

const mockRepository: jest.Mocked<CustomerRepositoryPort> = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateCustomerUseCase(mockRepository);
  });

  const validDto = {
    fullName: 'Juan Pérez',
    email: 'juan@test.com',
    phone: '3001234567',
    address: 'Calle 123',
    city: 'Bogotá',
    zipCode: '110111',
  };

  it('should create a customer successfully', async () => {
    mockRepository.create.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(validDto);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fullName).toBe('Juan Pérez');
      expect(result.value.email).toBe('juan@test.com');
    }
  });

  it('should call repository with correct data', async () => {
    mockRepository.create.mockResolvedValue(mockCustomer);

    await useCase.execute(validDto);

    expect(mockRepository.create).toHaveBeenCalledWith(validDto);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return failure when repository throws', async () => {
    mockRepository.create.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute(validDto);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect((result as Failure<string>).error).toBe('Error al crear el cliente');
    }
  });

  it('should map customer to DTO correctly', async () => {
    mockRepository.create.mockResolvedValue(mockCustomer);

    const result = await useCase.execute(validDto);

    if (result.ok) {
      expect(result.value.id).toBe('1');
      expect(result.value.city).toBe('Bogotá');
    }
  });
});