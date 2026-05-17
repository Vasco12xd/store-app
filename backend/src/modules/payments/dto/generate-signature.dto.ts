import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class GenerateSignatureDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}