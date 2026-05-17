import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { CreateCustomerDto } from '../../dto/create-customer.dto';
import { Failure } from '../../../../shared/result/result';

@Controller('customers')
export class CustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    const result = await this.createCustomerUseCase.execute(dto);

    if (result.ok === false) {
      throw new BadRequestException((result as Failure<string>).error);
    }

    return result.value;
  }
}