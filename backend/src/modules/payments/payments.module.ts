import { Module } from '@nestjs/common';
import { GenerateSignatureUseCase } from './application/generate-signature.use-case';
import { VerifyPaymentUseCase } from './application/verify-payment.use-case';
import { PaymentController } from './infrastructure/payment.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { WompiService } from './wompi.service';

@Module({
  imports: [TransactionsModule, DeliveriesModule],
  controllers: [PaymentController],
  providers: [GenerateSignatureUseCase, VerifyPaymentUseCase, WompiService],
  exports: [WompiService],
})
export class PaymentsModule {}