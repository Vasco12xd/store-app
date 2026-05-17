import { Delivery } from '../entities/delivery.entity';

export interface CreateDeliveryData {
  transactionId: string;
  customerId: string;
  productId: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface DeliveryRepositoryPort {
  create(data: CreateDeliveryData): Promise<Delivery>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
}

export const DELIVERY_REPOSITORY = 'DELIVERY_REPOSITORY';