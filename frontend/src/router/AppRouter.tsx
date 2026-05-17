import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductPage } from '../features/product/ProductPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { TransactionStatusPage } from '../features/transaction/TransactionStatusPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/status" element={<TransactionStatusPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};