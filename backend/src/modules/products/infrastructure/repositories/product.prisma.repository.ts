import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductPrismaRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return products.map(this.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? this.toDomain(product) : null;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
    });
    return this.toDomain(product);
  }

  private toDomain(raw: any): Product {
    return new Product(
      raw.id,
      raw.name,
      raw.description,
      Number(raw.price),
      raw.stockQuantity,
      raw.imageUrl,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}