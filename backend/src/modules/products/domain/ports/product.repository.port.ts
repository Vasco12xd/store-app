import { Product } from '../entities/product.entity';

export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  updateStock(id: string, quantity: number): Promise<Product>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';