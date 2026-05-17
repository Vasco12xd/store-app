import { Controller, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { GenerateSignatureUseCase } from '../application/generate-signature.use-case';
import { VerifyPaymentUseCase } from '../application/verify-payment.use-case';
import { GenerateSignatureDto } from '../dto/generate-signature.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Failure } from '../../../shared/result/result';

class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  wompiTransactionId: string;
}

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly generateSignatureUseCase: GenerateSignatureUseCase,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
  ) {}

  @Post('signature')
  async generateSignature(@Body() dto: GenerateSignatureDto) {
    const result = await this.generateSignatureUseCase.execute(dto.transactionId);
    if (result.ok === false) throw new BadRequestException((result as Failure<string>).error);
    return result.value;
  }

  @Post(':transactionId/verify')
  async verifyPayment(
    @Param('transactionId') transactionId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    const result = await this.verifyPaymentUseCase.execute(transactionId, dto.wompiTransactionId);
    if (result.ok === false) throw new BadRequestException((result as Failure<string>).error);
    return result.value;
  }
}