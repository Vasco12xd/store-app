import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { SummaryBackdrop } from './SummaryBackdrop';
import checkoutReducer from '../checkoutSlice';
import transactionReducer from '../../transaction/transactionSlice';
import productReducer from '../../product/productSlice';

const mockFees = {
    productAmount: 280000,
    baseFee: 3000,
    deliveryFee: 8000,
    totalAmount: 291000,
};

const mockProduct = {
    id: '1', name: 'Sony WH-1000XM5', description: 'Desc',
    price: 280000, stockQuantity: 10, imageUrl: null, inStock: true,
};

const mockCardData = {
    number: '4242424242424242', cardHolder: 'JUAN PEREZ',
    expMonth: '12', expYear: '28', cvc: '123',
    brand: 'VISA' as const, lastFour: '4242',
};

const renderWithStore = (preloadedState?: any) => {
    const store = configureStore({
        reducer: {
            checkout: checkoutReducer,
            transaction: transactionReducer,
            products: productReducer,
        },
        preloadedState,
    });
    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter><SummaryBackdrop /></MemoryRouter>
            </Provider>
        ),
    };
};

describe('SummaryBackdrop', () => {
    it('should render null when no fees', () => {
        const { container } = renderWithStore();
        expect(container.firstChild).toBeNull();
    });

    it('should render summary when fees exist', () => {
        renderWithStore({
            checkout: {
                step: 'summary', fees: mockFees, transactionId: 'tx-1',
                cardData: mockCardData, selectedProduct: mockProduct,
                customerId: null, customerData: null,
            },
            products: { items: [], selected: mockProduct, loading: false, error: null },
        });
        expect(screen.getByText('Resumen del pago')).toBeInTheDocument();
    });

    it('should show product amount', () => {
        renderWithStore({
            checkout: {
                step: 'summary', fees: mockFees, transactionId: 'tx-1',
                cardData: mockCardData, selectedProduct: mockProduct,
                customerId: null, customerData: null,
            },
            products: { items: [], selected: mockProduct, loading: false, error: null },
        });
        const elements = screen.getAllByText(/291/);
        expect(elements.length).toBeGreaterThan(0);
    });

    it('should show card last four digits', () => {
        renderWithStore({
            checkout: {
                step: 'summary', fees: mockFees, transactionId: 'tx-1',
                cardData: mockCardData, selectedProduct: mockProduct,
                customerId: null, customerData: null,
            },
            products: { items: [], selected: mockProduct, loading: false, error: null },
        });
        expect(screen.getByText(/4242/)).toBeInTheDocument();
    });

    it('should show pay button', () => {
        renderWithStore({
            checkout: {
                step: 'summary', fees: mockFees, transactionId: 'tx-1',
                cardData: mockCardData, selectedProduct: mockProduct,
                customerId: null, customerData: null,
            },
            products: { items: [], selected: mockProduct, loading: false, error: null },
        });
        expect(screen.getByText(/Confirmar y pagar/)).toBeInTheDocument();
    });

    it('should close backdrop when overlay is clicked', () => {
        const { store } = renderWithStore({
            checkout: {
                step: 'summary', fees: mockFees, transactionId: 'tx-1',
                cardData: mockCardData, selectedProduct: mockProduct,
                customerId: null, customerData: null,
            },
            products: { items: [], selected: mockProduct, loading: false, error: null },
        });

        const overlay = document.querySelector('.bg-black\\/50');
        fireEvent.click(overlay!);
        expect(store.getState().checkout.step).toBe('form');
    });

    it('should call payment API when pay button is clicked', async () => {
        const { api } = require('../../../services/api');
        api.post
            .mockResolvedValueOnce({
                data: {
                    reference: 'REF-123', amountInCents: 29100000,
                    signature: 'abc123', publicKey: 'pub_key',
                }
            })
            .mockResolvedValueOnce({
                data: {
                    transactionId: 'tx-1', status: 'APPROVED', deliveryId: 'del-1',
                }
            });

        renderWithStore({
            checkout: {
                step: 'summary', fees: mockFees, transactionId: 'tx-1',
                cardData: mockCardData, selectedProduct: mockProduct,
                customerId: null, customerData: null,
            },
            products: { items: [], selected: mockProduct, loading: false, error: null },
        });

        fireEvent.click(screen.getByText(/Confirmar y pagar/));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/payments/signature', { transactionId: 'tx-1' });
        });
    });
});