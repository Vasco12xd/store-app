import { Delivery } from '../domain/entities/delivery.entity';

export class DeliveryResponseDto {
  id: string;
  transactionId: string;
  customerId: string;
  productId: string;
  status: string;
  address: string;
  city: string;
  zipCode: string;
  assignedAt: Date;

  static fromEntity(delivery: Delivery): DeliveryResponseDto {
    const dto = new DeliveryResponseDto();
    dto.id = delivery.id;
    dto.transactionId = delivery.transactionId;
    dto.customerId = delivery.customerId;
    dto.productId = delivery.productId;
    dto.status = delivery.status;
    dto.address = delivery.address;
    dto.city = delivery.city;
    dto.zipCode = delivery.zipCode;
    dto.assignedAt = delivery.assignedAt;
    return dto;
  }
}