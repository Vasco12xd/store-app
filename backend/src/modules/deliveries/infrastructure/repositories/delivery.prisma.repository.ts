import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { DeliveryRepositoryPort, CreateDeliveryData } from '../../domain/ports/delivery.repository.port';
import { Delivery, DeliveryStatus } from '../../domain/entities/delivery.entity';

@Injectable()
export class DeliveryPrismaRepository implements DeliveryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDeliveryData): Promise<Delivery> {
    const delivery = await this.prisma.delivery.create({ data });
    return this.toDomain(delivery);
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: { transactionId },
    });
    return delivery ? this.toDomain(delivery) : null;
  }

  private toDomain(raw: any): Delivery {
    return new Delivery(
      raw.id,
      raw.transactionId,
      raw.customerId,
      raw.productId,
      raw.status as DeliveryStatus,
      raw.address,
      raw.city,
      raw.zipCode,
      raw.assignedAt,
      raw.updatedAt,
    );
  }
}