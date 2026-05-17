import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionStatus } from '../domain/entities/transaction.entity';

export class UpdateTransactionDto {
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsString()
  @IsOptional()
  wompiTransactionId?: string;
}