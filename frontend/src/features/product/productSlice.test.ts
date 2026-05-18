import productReducer, {
  selectProduct,
  fetchProducts,
  Product,
} from './productSlice';

const mockProduct: Product = {
  id: '1',
  name: 'Sony WH-1000XM5',
  description: 'Auriculares premium',
  price: 350000,
  stockQuantity: 10,
  imageUrl: 'https://image.url',
  inStock: true,
};

jest.mock('../../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('productSlice', () => {
  const initialState = {
    items: [],
    selected: null,
    loading: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(productReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle selectProduct', () => {
    const state = productReducer(initialState, selectProduct(mockProduct));
    expect(state.selected).toEqual(mockProduct);
  });

  it('should handle fetchProducts.pending', () => {
    const state = productReducer(initialState, { type: fetchProducts.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchProducts.fulfilled', () => {
    const state = productReducer(
      { ...initialState, loading: true },
      { type: fetchProducts.fulfilled.type, payload: [mockProduct] }
    );
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockProduct);
  });

  it('should handle fetchProducts.rejected', () => {
    const state = productReducer(
      { ...initialState, loading: true },
      { type: fetchProducts.rejected.type }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error al cargar los productos');
  });

  it('should keep previous items when selecting a product', () => {
    const stateWithItems = { ...initialState, items: [mockProduct] };
    const state = productReducer(stateWithItems, selectProduct(mockProduct));
    expect(state.items).toHaveLength(1);
    expect(state.selected).toEqual(mockProduct);
  });
});