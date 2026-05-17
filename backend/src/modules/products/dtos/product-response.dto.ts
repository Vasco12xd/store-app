import { Product } from '../domain/entities/product.entity';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  inStock: boolean;

  static fromEntity(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.name = product.name;
    dto.description = product.description;
    dto.price = Number(product.price);
    dto.stockQuantity = product.stockQuantity;
    dto.imageUrl = product.imageUrl;
    dto.inStock = product.hasStock();
    return dto;
  }
}