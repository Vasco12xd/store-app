import checkoutReducer, {
  setStep,
  setCustomer,
  setCardData,
  setTransaction,
  setSelectedProduct,
  resetCheckout,
  CheckoutState,
} from './checkoutSlice';

const initialState: CheckoutState = {
  step: 'product',
  customerId: null,
  transactionId: null,
  customerData: null,
  cardData: null,
  selectedProduct: null,
  fees: null,
};

const mockCustomerData = {
  fullName: 'Juan Pérez',
  email: 'juan@test.com',
  phone: '3001234567',
  address: 'Calle 123',
  city: 'Bogotá',
  zipCode: '110111',
};

const mockCardData = {
  number: '4242424242424242',
  cardHolder: 'JUAN PEREZ',
  expMonth: '12',
  expYear: '28',
  cvc: '123',
  brand: 'VISA' as const,
  lastFour: '4242',
};

const mockProduct = {
  id: '1',
  name: 'Sony',
  description: 'Desc',
  price: 350000,
  stockQuantity: 10,
  imageUrl: null,
  inStock: true,
};

describe('checkoutSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    const state = checkoutReducer(undefined, { type: '@@INIT' });
    expect(state.step).toBe('product');
    expect(state.customerId).toBeNull();
  });

  it('should handle setStep', () => {
    const state = checkoutReducer(initialState, setStep('form'));
    expect(state.step).toBe('form');
  });

  it('should handle setCustomer', () => {
    const state = checkoutReducer(
      initialState,
      setCustomer({ id: 'cust-1', data: mockCustomerData })
    );
    expect(state.customerId).toBe('cust-1');
    expect(state.customerData).toEqual(mockCustomerData);
  });

  it('should handle setCardData', () => {
    const state = checkoutReducer(initialState, setCardData(mockCardData));
    expect(state.cardData).toEqual(mockCardData);
  });

  it('should handle setTransaction', () => {
    const fees = {
      productAmount: 350000,
      baseFee: 3000,
      deliveryFee: 8000,
      totalAmount: 361000,
    };
    const state = checkoutReducer(
      initialState,
      setTransaction({ id: 'tx-1', fees })
    );
    expect(state.transactionId).toBe('tx-1');
    expect(state.fees).toEqual(fees);
  });

  it('should handle setSelectedProduct', () => {
    const state = checkoutReducer(initialState, setSelectedProduct(mockProduct));
    expect(state.selectedProduct).toEqual(mockProduct);
  });

  it('should handle resetCheckout', () => {
    const filledState = {
      ...initialState,
      step: 'summary' as const,
      customerId: 'cust-1',
      transactionId: 'tx-1',
      customerData: mockCustomerData,
      cardData: mockCardData,
    };
    const state = checkoutReducer(filledState, resetCheckout());
    expect(state.step).toBe('product');
    expect(state.customerId).toBeNull();
    expect(state.transactionId).toBeNull();
    expect(state.customerData).toBeNull();
  });

  it('should persist step to localStorage', () => {
    checkoutReducer(initialState, setStep('summary'));
    const saved = JSON.parse(localStorage.getItem('checkout_state') || '{}');
    expect(saved.step).toBe('summary');
  });

  it('should persist customerData to localStorage', () => {
    checkoutReducer(
      initialState,
      setCustomer({ id: 'cust-1', data: mockCustomerData })
    );
    const saved = JSON.parse(localStorage.getItem('checkout_state') || '{}');
    expect(saved.customerData).toEqual(mockCustomerData);
  });

  it('should clear localStorage on resetCheckout', () => {
    localStorage.setItem('checkout_state', JSON.stringify({ step: 'summary' }));
    checkoutReducer(initialState, resetCheckout());
    expect(localStorage.getItem('checkout_state')).toBeNull();
  });
});