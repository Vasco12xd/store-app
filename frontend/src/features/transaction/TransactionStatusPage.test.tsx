import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { TransactionStatusPage } from './TransactionStatusPage';
import productReducer from '../product/productSlice';
import checkoutReducer from '../checkout/checkoutSlice';
import transactionReducer, { setResult } from './transactionSlice';

const renderWithStore = (preloadedState?: any) => {
    const store = configureStore({
        reducer: {
            products: productReducer,
            checkout: checkoutReducer,
            transaction: transactionReducer,
        },
        preloadedState,
    });
    return {
        store, ...render(
            <Provider store={store}>
                <MemoryRouter><TransactionStatusPage /></MemoryRouter>
            </Provider>
        )
    };
};

describe('TransactionStatusPage', () => {
    it('should show approved message when status is APPROVED', () => {
        renderWithStore({
            transaction: {
                result: {
                    transactionId: 'tx-1',
                    wompiTransactionId: 'wompi-1',
                    status: 'APPROVED',
                    deliveryId: 'del-1',
                },
                loading: false,
                error: null,
            },
        });
        expect(screen.getByText(/Pago exitoso/)).toBeInTheDocument();
    });

    it('should show declined message when status is DECLINED', () => {
        renderWithStore({
            transaction: {
                result: {
                    transactionId: 'tx-1',
                    wompiTransactionId: 'wompi-1',
                    status: 'DECLINED',
                },
                loading: false,
                error: null,
            },
        });
        expect(screen.getByText(/Pago declinado/)).toBeInTheDocument();
    });

    it('should show loading spinner when loading', () => {
        renderWithStore({
            transaction: { result: null, loading: true, error: null },
        });
        expect(screen.getByText(/Procesando pago/)).toBeInTheDocument();
    });

    it('should show volver a la tienda button', () => {
        renderWithStore({
            transaction: {
                result: {
                    transactionId: 'tx-1',
                    wompiTransactionId: 'wompi-1',
                    status: 'APPROVED',
                },
                loading: false,
                error: null,
            },
        });
        expect(screen.getByText(/Volver a la tienda/)).toBeInTheDocument();
    });

    it('should show error status message', () => {
        renderWithStore({
            transaction: {
                result: {
                    transactionId: 'tx-1',
                    wompiTransactionId: 'wompi-1',
                    status: 'ERROR',
                },
                loading: false,
                error: null,
            },
        });
        expect(screen.getByText(/Error en el pago/)).toBeInTheDocument();
    });

    it('should show delivery info when approved and deliveryId exists', () => {
        renderWithStore({
            transaction: {
                result: {
                    transactionId: 'tx-1',
                    wompiTransactionId: 'wompi-1',
                    status: 'APPROVED',
                    deliveryId: 'del-1',
                },
                loading: false,
                error: null,
            },
            products: {
                items: [],
                selected: {
                    id: '1', name: 'Sony WH-1000XM5', description: 'Desc',
                    price: 350000, stockQuantity: 10, imageUrl: null, inStock: true,
                },
                loading: false,
                error: null,
            },
        });
        expect(screen.getByText(/En camino a tu dirección/)).toBeInTheDocument();
    });

    it('should handle go home button click', () => {
        const { store } = renderWithStore({
            transaction: {
                result: {
                    transactionId: 'tx-1',
                    wompiTransactionId: 'wompi-1',
                    status: 'APPROVED',
                },
                loading: false,
                error: null,
            },
        });

        fireEvent.click(screen.getByText(/Volver a la tienda/));
        expect(store.getState().transaction.result).toBeNull();
    });
});