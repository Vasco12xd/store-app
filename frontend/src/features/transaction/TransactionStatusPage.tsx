import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useAppDispatch';
import { clearResult } from './transactionSlice';
import { fetchProducts } from '../product/productSlice';

export const TransactionStatusPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { result, loading } = useAppSelector((s) => s.transaction);
  const { selected } = useAppSelector((s) => s.products);

  useEffect(() => {
    if (!result && !loading) {
      navigate('/');
    }
  }, [result, loading]);

  const handleGoHome = () => {
    dispatch(clearResult());
    dispatch(fetchProducts());
    navigate('/');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Procesando pago...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isApproved = result.status === 'APPROVED';
  const isDeclined = result.status === 'DECLINED';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          <div className="flex flex-col items-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4
              ${isApproved ? 'bg-green-100' : 'bg-red-100'}`}>
              {isApproved ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <h1 className={`text-2xl font-bold mb-2
              ${isApproved ? 'text-green-600' : 'text-red-500'}`}>
              {isApproved ? '¡Pago exitoso!' : isDeclined ? 'Pago declinado' : 'Error en el pago'}
            </h1>
            <p className="text-gray-400 text-sm text-center">
              {isApproved
                ? 'Tu pedido ha sido confirmado y está en camino'
                : 'No se pudo procesar tu pago. Intenta de nuevo'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Detalle de la transacción</h3>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Estado</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs
                  ${isApproved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'}`}>
                  {isApproved ? 'Aprobado' : isDeclined ? 'Declinado' : 'Error'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">ID Transacción</span>
                <span className="font-mono text-xs text-gray-600 truncate max-w-32">
                  {result.transactionId.split('-')[0].toUpperCase()}
                </span>
              </div>

              {result.wompiTransactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Ref. Pago</span>
                  <span className="font-mono text-xs text-gray-600 truncate max-w-32">
                    {result.wompiTransactionId.slice(0, 12)}...
                  </span>
                </div>
              )}

              {result.deliveryId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ID Entrega</span>
                  <span className="font-mono text-xs text-green-600 truncate max-w-32">
                    {result.deliveryId.split('-')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {selected && isApproved && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                {selected.imageUrl && (
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{selected.name}</p>
                  <p className="text-gray-400 text-xs">En camino a tu dirección</p>
                </div>
              </div>
            )}
          </div>

          {isApproved && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4
              flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div>
                <p className="font-semibold text-primary text-sm">Pedido en proceso</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Recibirás una confirmación en tu correo electrónico
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleGoHome}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold
              hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};