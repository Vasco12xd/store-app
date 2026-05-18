import { PaymentController } from './payment.controller';
import { GenerateSignatureUseCase } from '../application/generate-signature.use-case';
import { VerifyPaymentUseCase } from '../application/verify-payment.use-case';
import { BadRequestException } from '@nestjs/common';

const mockGenerateSignature = { execute: jest.fn() } as unknown as jest.Mocked<GenerateSignatureUseCase>;
const mockVerifyPayment = { execute: jest.fn() } as unknown as jest.Mocked<VerifyPaymentUseCase>;

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PaymentController(mockGenerateSignature, mockVerifyPayment);
  });

  it('should generate signature', async () => {
    const signature = {
      reference: 'REF-123',
      amountInCents: 36100000,
      currency: 'COP',
      signature: 'abc123',
      publicKey: 'pub_test_key',
    };
    mockGenerateSignature.execute.mockResolvedValue({ ok: true, value: signature });

    const result = await controller.generateSignature({ transactionId: 'tx-1' });
    expect(result).toEqual(signature);
  });

  it('should throw BadRequestException when signature generation fails', async () => {
    mockGenerateSignature.execute.mockResolvedValue({ ok: false, error: 'Error' });

    await expect(controller.generateSignature({ transactionId: 'tx-1' }))
      .rejects.toThrow(BadRequestException);
  });

  it('should verify payment', async () => {
    const verifyResult = {
      transactionId: 'tx-1',
      wompiTransactionId: 'sim_123',
      status: 'APPROVED',
    };
    mockVerifyPayment.execute.mockResolvedValue({ ok: true, value: verifyResult });

    const result = await controller.verifyPayment('tx-1', { wompiTransactionId: 'sim_123' });
    expect(result).toEqual(verifyResult);
  });

  it('should throw BadRequestException when verification fails', async () => {
    mockVerifyPayment.execute.mockResolvedValue({ ok: false, error: 'Error' });

    await expect(controller.verifyPayment('tx-1', { wompiTransactionId: 'sim_123' }))
      .rejects.toThrow(BadRequestException);
  });
});