import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ProductPage } from './ProductPage';
import productReducer from './productSlice';
import checkoutReducer from '../checkout/checkoutSlice';
import transactionReducer from '../transaction/transactionSlice';

jest.mock('../../services/api', () => ({
    api: {
        get: jest.fn().mockResolvedValue({
            data: [
                {
                    id: '1',
                    name: 'Sony WH-1000XM5',
                    description: 'Auriculares premium',
                    price: 350000,
                    stockQuantity: 10,
                    imageUrl: null,
                    inStock: true,
                },
            ],
        }),
    },
}));

const renderWithStore = (preloadedState?: any) => {
    const store = configureStore({
        reducer: {
            products: productReducer,
            checkout: checkoutReducer,
            transaction: transactionReducer,
        },
        preloadedState,
    });
    return render(
        <Provider store={store}>
            <MemoryRouter><ProductPage /></MemoryRouter>
        </Provider>
    );
};

describe('ProductPage', () => {
    it('should render store header', () => {
        renderWithStore();
        expect(screen.getByText('Store App')).toBeInTheDocument();
    });

    it('should show loading spinner initially', () => {
        renderWithStore();
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should render products after loading', async () => {
        renderWithStore();
        await waitFor(() => {
            expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument();
        });
    });

    it('should show error message when fetch fails', async () => {
        const { api } = require('../../services/api');
        api.get.mockRejectedValueOnce(new Error('Network error'));

        renderWithStore();

        await waitFor(() => {
            expect(screen.getByText('Error al cargar los productos')).toBeInTheDocument();
        });
    });

    it('should show nuestros productos title', () => {
        renderWithStore();
        expect(screen.getByText('Nuestros productos')).toBeInTheDocument();
    });
});