import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import transactionReducer from '../features/transaction/transactionSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;