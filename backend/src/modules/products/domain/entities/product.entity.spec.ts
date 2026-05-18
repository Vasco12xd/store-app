import { Product } from './product.entity';

const makeProduct = (stock: number) =>
  new Product(
    '1',
    'Sony WH-1000XM5',
    'Auriculares premium',
    350000,
    stock,
    'https://image.url',
    new Date(),
    new Date(),
  );

describe('Product Entity', () => {
  it('should create a product with correct properties', () => {
    const product = makeProduct(10);
    expect(product.id).toBe('1');
    expect(product.name).toBe('Sony WH-1000XM5');
    expect(product.price).toBe(350000);
    expect(product.stockQuantity).toBe(10);
  });

  it('hasStock should return true when stockQuantity > 0', () => {
    const product = makeProduct(5);
    expect(product.hasStock()).toBe(true);
  });

  it('hasStock should return false when stockQuantity is 0', () => {
    const product = makeProduct(0);
    expect(product.hasStock()).toBe(false);
  });

  it('hasStock should return false when stockQuantity is negative', () => {
    const product = makeProduct(-1);
    expect(product.hasStock()).toBe(false);
  });
});