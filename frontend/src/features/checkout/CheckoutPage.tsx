import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useAppDispatch';
import { setCustomer, setTransaction, setStep, setSelectedProduct, setVatAmount } from './checkoutSlice';
import { CardForm } from './components/CardForm';
import { DeliveryForm } from './components/DeliveryForm';
import { SummaryBackdrop } from './components/SummaryBackdrop';
import { api } from '../../services/api';
import type { CustomerData } from './checkoutSlice';

const BASE_FEE = 3000;
const DELIVERY_FEE = 8000;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selected } = useAppSelector((s) => s.products);
  const { selectedProduct, cardData, transactionId, customerData, step } = useAppSelector((s) => s.checkout);

  const currentProduct = selected || selectedProduct;

  const [deliveryData, setDeliveryData] = useState<CustomerData>({
    fullName: customerData?.fullName || '',
    email: customerData?.email || '',
    phone: customerData?.phone || '',
    address: customerData?.address || '',
    city: customerData?.city || '',
    zipCode: customerData?.zipCode || '',
  });

  const [deliveryErrors, setDeliveryErrors] = useState<Partial<CustomerData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentProduct) {
    navigate('/');
    return null;
  }

  const vatAmount = Math.round(currentProduct.price * 0.19);
  const totalAmount = currentProduct.price + BASE_FEE + DELIVERY_FEE + vatAmount;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const handleDeliveryChange = (field: keyof CustomerData, value: string) => {
    setDeliveryData((prev) => ({ ...prev, [field]: value }));
    if (deliveryErrors[field]) {
      setDeliveryErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateDelivery = (): boolean => {
    const errors: Partial<CustomerData> = {};
    if (!deliveryData.fullName.trim()) errors.fullName = 'Requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryData.email)) errors.email = 'Email inválido';
    if (!/^\+?[\d\s\-]{7,15}$/.test(deliveryData.phone)) errors.phone = 'Teléfono inválido';
    if (!deliveryData.address.trim()) errors.address = 'Requerido';
    if (!deliveryData.city.trim()) errors.city = 'Requerido';
    if (!deliveryData.zipCode.trim()) errors.zipCode = 'Requerido';
    setDeliveryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  

  const handleContinue = async () => {
    console.log('handleContinue ejecutado');
  console.log('cardData:', cardData);
  console.log('transactionId:', transactionId);

  if (!cardData) {
    console.log('Saliendo por cardData null');
    setError('Por favor completa los datos de la tarjeta');
    return;
  }

  if (transactionId) {
  console.log('Saliendo por transactionId existente:', transactionId);
  dispatch(setStep('summary'));
  return;
}

console.log('Validando delivery...'); // ← agrega aquí

if (!validateDelivery()) {
  setError('Por favor corrige los errores en el formulario');
  return;
}

console.log('Pasó validación — llamando API');

    setLoading(true);
    setError('');

    console.log('Procesando transacción con datos:', {
      deliveryData,
      cardData,
      currentProduct,
      totalAmount,
    });

    try {
      const customerRes = await api.post('/customers', deliveryData);
      const customerId = customerRes.data.id;
      dispatch(setCustomer({ id: customerId, data: deliveryData }));

      const txRes = await api.post('/transactions', {
        customerId,
        productId: currentProduct.id,
        productAmount: currentProduct.price,
        baseFee: BASE_FEE,
        deliveryFee: DELIVERY_FEE,
        totalAmount,
        cardLastFour: cardData.lastFour,
        cardBrand: cardData.brand || 'VISA',
      });

      console.log('Response transacción:', txRes.data);

      dispatch(setTransaction({
        id: txRes.data.id,
        fees: {
          productAmount: currentProduct.price,
          baseFee: BASE_FEE,
          deliveryFee: DELIVERY_FEE,
          totalAmount,
        },
      }));

      dispatch(setSelectedProduct(currentProduct));
      dispatch(setVatAmount(txRes.data.vatAmount));
      dispatch(setStep('summary'));
    } catch (err) {
      setError('Error al procesar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-900">Datos de pago</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-32">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 mb-4 flex items-center gap-3">
          {currentProduct.imageUrl && (
            <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-14 h-14 rounded-xl object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{currentProduct.name}</p>
            <p className="text-primary font-bold">{formatPrice(currentProduct.price)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <CardForm />
          <DeliveryForm
            data={deliveryData}
            onChange={handleDeliveryChange}
            errors={deliveryErrors}
          />
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 rounded-xl p-3 text-sm text-center">
            {error}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col gap-1 mb-3 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(currentProduct.price + BASE_FEE + DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (19%)</span>
              <span>{formatPrice(vatAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
              <span>Total a pagar</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base
              hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Ver resumen
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {step === 'summary' && <SummaryBackdrop />}
    </div>
  );
};