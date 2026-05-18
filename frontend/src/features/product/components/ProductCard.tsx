import { Product, selectProduct } from '../productSlice';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { setStep, setSelectedProduct } from '../../checkout/checkoutSlice';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleBuy = () => {
    dispatch(selectProduct(product));
    dispatch(setSelectedProduct(product));
    dispatch(setStep('form'));
    navigate('/checkout');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-36 object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              {product.stockQuantity} disponibles
            </span>
          ) : (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm flex-1 mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-xl">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleBuy}
          disabled={!product.inStock}
          className={`mt-3 w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
            ${product.inStock
              ? 'bg-primary text-white hover:bg-primary-dark active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Pagar con tarjeta
        </button>
      </div>
    </div>
  );
};