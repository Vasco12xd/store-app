import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useAppDispatch';
import { setCustomer, setTransaction, setStep, CustomerData } from './checkoutSlice';
import { CardForm } from './components/CardForm';
import { DeliveryForm } from './components/DeliveryForm';
import { api } from '../../services/api';

const BASE_FEE = 3000;
const DELIVERY_FEE = 8000;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector((state) => state.products);
  const { cardData } = useAppSelector((state) => state.checkout);

  const savedCustomer = useAppSelector((state) => state.checkout.customerData);

  const [deliveryData, setDeliveryData] = useState<CustomerData>({
    fullName: savedCustomer?.fullName || '',
    email: savedCustomer?.email || '',
    phone: savedCustomer?.phone || '',
    address: savedCustomer?.address || '',
    city: savedCustomer?.city || '',
    zipCode: savedCustomer?.zipCode || '',
  });

  const [deliveryErrors, setDeliveryErrors] = useState<Partial<CustomerData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!selected) {
    navigate('/');
    return null;
  }

  const totalAmount = selected.price + BASE_FEE + DELIVERY_FEE;

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
    console.log('handleContinue called');
  console.log('cardData:', cardData);
  console.log('deliveryData:', deliveryData);
    if (!cardData) {
      console.log('cardData is null - blocking');
      setError('Por favor completa los datos de la tarjeta');
      return;
    }

    const isValid = validateDelivery();
  console.log('validateDelivery result:', isValid);

  if (!isValid) {
    setError('Por favor corrige los errores en el formulario');
    return;
  }

  console.log('Calling APIs...');

    setLoading(true);
    setError('');

    try {
      const customerRes = await api.post('/customers', deliveryData);
      const customerId = customerRes.data.id;

      dispatch(setCustomer({ id: customerId, data: deliveryData }));

      const txRes = await api.post('/transactions', {
        customerId,
        productId: selected.id,
        productAmount: selected.price,
        baseFee: BASE_FEE,
        deliveryFee: DELIVERY_FEE,
        totalAmount,
        cardLastFour: cardData.lastFour,
        cardBrand: cardData.brand || 'VISA',
      });

      dispatch(setTransaction({
        id: txRes.data.id,
        fees: {
          productAmount: selected.price,
          baseFee: BASE_FEE,
          deliveryFee: DELIVERY_FEE,
          totalAmount,
        },
      }));

      dispatch(setStep('summary'));
    } catch (err) {
      setError('Error al procesar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

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
          {selected.imageUrl && (
            <img src={selected.imageUrl} alt={selected.name} className="w-14 h-14 rounded-xl object-cover" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{selected.name}</p>
            <p className="text-primary font-bold">{formatPrice(selected.price)}</p>
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
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <span>Total a pagar</span>
            <span className="font-bold text-gray-900">{formatPrice(totalAmount)}</span>
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
    </div>
  );
};