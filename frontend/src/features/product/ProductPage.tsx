import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useAppDispatch';
import { fetchProducts } from './productSlice';
import { ProductCard } from './components/ProductCard';

export const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-app max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-none">Store App</h1>
            <p className="text-gray-400 text-xs">Tecnología premium</p>
          </div>
        </div>
      </header>

      <main className="container-app max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Nuestros productos</h2>
          <p className="text-gray-500 text-sm mt-1">Selecciona el producto que deseas comprar</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};