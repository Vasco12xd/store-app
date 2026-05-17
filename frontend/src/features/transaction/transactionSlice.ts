import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TransactionResult {
  transactionId: string;
  wompiTransactionId: string;
  status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING';
  deliveryId?: string;
}

interface TransactionState {
  result: TransactionResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  result: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setResult(state, action: PayloadAction<TransactionResult>) {
      state.result = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearResult(state) {
      state.result = null;
      state.error = null;
    },
  },
});

export const { setLoading, setResult, setError, clearResult } = transactionSlice.actions;
export default transactionSlice.reducer;