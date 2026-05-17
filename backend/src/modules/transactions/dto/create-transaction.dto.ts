import { IsNotEmpty, IsNumber, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(0)
  productAmount: number;

  @IsNumber()
  @Min(0)
  baseFee: number;

  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsString()
  @Length(4, 4)
  cardLastFour: string;

  @IsString()
  @IsNotEmpty()
  cardBrand: string;
}