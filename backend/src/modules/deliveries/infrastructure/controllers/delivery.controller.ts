import { Controller, Post, Param, BadRequestException } from '@nestjs/common';
import { CreateDeliveryUseCase } from '../../application/use-cases/create-delivery.use-case';
import { Failure } from '../../../../shared/result/result';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly createDeliveryUseCase: CreateDeliveryUseCase) {}

  @Post(':transactionId')
  async create(@Param('transactionId') transactionId: string) {
    const result = await this.createDeliveryUseCase.execute(transactionId);

    if (result.ok === false) {
      throw new BadRequestException((result as Failure<string>).error);
    }

    return result.value;
  }
}