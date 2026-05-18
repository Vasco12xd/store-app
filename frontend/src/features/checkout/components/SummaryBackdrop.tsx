import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAppDispatch';
import { setStep, resetCheckout } from '../checkoutSlice';
import { setLoading, setResult } from '../../transaction/transactionSlice';
import { api } from '../../../services/api';

declare const WidgetCheckout: any;

export const SummaryBackdrop = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  const { fees, transactionId, cardData } = useAppSelector((s) => s.checkout);
  const { selected } = useAppSelector((s) => s.products);

  if (!fees || !selected || !transactionId) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const handlePay = async () => {
  setPaying(true);
  try {
    const sigRes = await api.post('/payments/signature', { transactionId });
    console.log('Signature generated:', sigRes.data);

    // Simulamos el resultado del pago para ambiente de desarrollo
    const simulatedWompiId = `sim_${Date.now()}`;

    const verifyRes = await api.post(`/payments/${transactionId}/verify`, {
      wompiTransactionId: simulatedWompiId,
    });

    dispatch(setResult({
      transactionId,
      wompiTransactionId: simulatedWompiId,
      status: verifyRes.data.status,
      deliveryId: verifyRes.data.deliveryId,
    }));

    dispatch(resetCheckout());
    navigate('/status');
  } catch (err) {
    console.error('Payment error:', err);
    setPaying(false);
  }
};

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(setStep('form'))}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl
        animate-[slideUp_0.3s_ease-out]"
      >
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-5 py-4">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Resumen del pago</h2>
            <p className="text-gray-400 text-sm mb-5">Revisa los detalles antes de pagar</p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                {selected.imageUrl && (
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{selected.name}</p>
                  <p className="text-gray-400 text-xs">1 unidad</p>
                </div>
                <p className="font-bold text-gray-900">{formatPrice(fees.productAmount)}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(fees.productAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Fee base</span>
                  <span>{formatPrice(fees.baseFee)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Fee de envío</span>
                  <span>{formatPrice(fees.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-1">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(fees.totalAmount)}</span>
                </div>
              </div>
            </div>

            {cardData && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5">
                <div className="w-10 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md
                  flex items-center justify-center">
                  {cardData.brand === 'VISA' && (
                    <span className="text-white font-bold text-xs italic">VISA</span>
                  )}
                  {cardData.brand === 'MASTERCARD' && (
                    <div className="flex">
                      <div className="w-3 h-3 bg-red-500 rounded-full opacity-90" />
                      <div className="w-3 h-3 bg-yellow-400 rounded-full -ml-1 opacity-90" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tarjeta de crédito</p>
                  <p className="text-sm font-semibold text-gray-900">
                    **** **** **** {cardData.lastFour}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-base
                hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50
                flex items-center justify-center gap-2 mb-4"
            >
              {paying ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Confirmar y pagar {formatPrice(fees.totalAmount)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};