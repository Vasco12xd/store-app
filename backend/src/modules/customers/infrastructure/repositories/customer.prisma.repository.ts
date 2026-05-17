import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { CustomerRepositoryPort, CreateCustomerData } from '../../domain/ports/customer.repository.port';
import { Customer } from '../../domain/entities/customer.entity';

@Injectable()
export class CustomerPrismaRepository implements CustomerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerData): Promise<Customer> {
    const customer = await this.prisma.customer.create({ data });
    return this.toDomain(customer);
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    return customer ? this.toDomain(customer) : null;
  }

  private toDomain(raw: any): Customer {
    return new Customer(
      raw.id,
      raw.fullName,
      raw.email,
      raw.phone,
      raw.address,
      raw.city,
      raw.zipCode,
      raw.createdAt,
    );
  }
}