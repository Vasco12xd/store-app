import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CheckoutStep = 'product' | 'form' | 'summary' | 'status';

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface CardData {
  number: string;
  cardHolder: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  brand: 'VISA' | 'MASTERCARD' | '';
  lastFour: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  customerId: string | null;
  transactionId: string | null;
  customerData: CustomerData | null;
  cardData: CardData | null;
  fees: {
    productAmount: number;
    baseFee: number;
    deliveryFee: number;
    totalAmount: number;
  } | null;
}

const STORAGE_KEY = 'checkout_state';

const loadFromStorage = (): Partial<CheckoutState> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const initialState: CheckoutState = {
  step: 'product',
  customerId: null,
  transactionId: null,
  customerData: null,
  cardData: null,
  fees: null,
  ...loadFromStorage(),
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<CheckoutStep>) {
      state.step = action.payload;
      saveToStorage(state);
    },
    setCustomer(state, action: PayloadAction<{ id: string; data: CustomerData }>) {
      state.customerId = action.payload.id;
      state.customerData = action.payload.data;
      saveToStorage(state);
    },
    setCardData(state, action: PayloadAction<CardData>) {
      state.cardData = action.payload;
      saveToStorage(state);
    },
    setTransaction(state, action: PayloadAction<{ id: string; fees: CheckoutState['fees'] }>) {
      state.transactionId = action.payload.id;
      state.fees = action.payload.fees;
      saveToStorage(state);
    },
    resetCheckout(state) {
      state.step = 'product';
      state.customerId = null;
      state.transactionId = null;
      state.customerData = null;
      state.cardData = null;
      state.fees = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

const saveToStorage = (state: CheckoutState) => {
  try {
    const toSave = {
      step: state.step,
      customerId: state.customerId,
      transactionId: state.transactionId,
      customerData: state.customerData,
      fees: state.fees,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
};

export const { setStep, setCustomer, setCardData, setTransaction, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;