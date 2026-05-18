import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import productReducer from '../productSlice';
import checkoutReducer from '../../checkout/checkoutSlice';
import transactionReducer from '../../transaction/transactionSlice';

const mockProduct = {
    id: '1',
    name: 'Sony WH-1000XM5',
    description: 'Auriculares premium',
    price: 350000,
    stockQuantity: 10,
    imageUrl: 'https://image.url',
    inStock: true,
};

const outOfStockProduct = { ...mockProduct, stockQuantity: 0, inStock: false };

const renderWithStore = (component: React.ReactElement) => {
    const store = configureStore({
        reducer: {
            products: productReducer,
            checkout: checkoutReducer,
            transaction: transactionReducer,
        },
    });
    return render(
        <Provider store={store}>
            <MemoryRouter>{component}</MemoryRouter>
        </Provider>
    );
};

describe('ProductCard', () => {
    it('should render product name', () => {
        renderWithStore(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument();
    });

    it('should render product price formatted', () => {
        renderWithStore(<ProductCard product={mockProduct} />);
        expect(screen.getByText(/350/)).toBeInTheDocument();
    });

    it('should show stock quantity when in stock', () => {
        renderWithStore(<ProductCard product={mockProduct} />);
        expect(screen.getByText(/10 disponibles/)).toBeInTheDocument();
    });

    it('should show agotado when out of stock', () => {
        renderWithStore(<ProductCard product={outOfStockProduct} />);
        expect(screen.getByText(/Agotado/)).toBeInTheDocument();
    });

    it('should disable button when out of stock', () => {
        renderWithStore(<ProductCard product={outOfStockProduct} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should enable button when in stock', () => {
        renderWithStore(<ProductCard product={mockProduct} />);
        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });

    it('should navigate to checkout when buy button is clicked', () => {
        const store = configureStore({
            reducer: {
                products: productReducer,
                checkout: checkoutReducer,
                transaction: transactionReducer,
            },
        });

        let navigatedTo = '';
        const MockRouter = ({ children }: any) => {
            const navigate = (path: string) => { navigatedTo = path; };
            return <MemoryRouter>{children}</MemoryRouter>;
        };

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProductCard product={mockProduct} />
                </MemoryRouter>
            </Provider>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(store.getState().checkout.step).toBe('form');
    });
});