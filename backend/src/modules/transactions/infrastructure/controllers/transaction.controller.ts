import { Controller, Post, Patch, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { UpdateTransactionUseCase } from '../../application/use-cases/update-transaction.use-case';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../../dto/update-transaction.dto';
import { Failure } from '../../../../shared/result/result';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    const result = await this.createTransactionUseCase.execute(dto);

    if (result.ok === false) {
      throw new BadRequestException((result as Failure<string>).error);
    }

    return result.value;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    const result = await this.updateTransactionUseCase.execute(id, dto);

    if (result.ok === false) {
      throw new NotFoundException((result as Failure<string>).error);
    }

    return result.value;
  }
}