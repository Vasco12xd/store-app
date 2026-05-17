import { Inject, Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../../shared/result/result';
import { CustomerRepositoryPort, CUSTOMER_REPOSITORY } from '../../domain/ports/customer.repository.port';
import { CreateCustomerDto } from '../../dto/create-customer.dto';
import { CustomerResponseDto } from '../../dto/customer-response.dto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<Result<CustomerResponseDto>> {
    try {
      const customer = await this.customerRepository.create(dto);
      return ok(CustomerResponseDto.fromEntity(customer));
    } catch (error) {
      return fail('Error al crear el cliente');
    }
  }
}