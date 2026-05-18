import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutPage } from './CheckoutPage';
import checkoutReducer from './checkoutSlice';
import transactionReducer from '../transaction/transactionSlice';
import productReducer from '../product/productSlice';

const mockProduct = {
    id: '1', name: 'Sony WH-1000XM5', description: 'Auriculares premium',
    price: 350000, stockQuantity: 10, imageUrl: null, inStock: true,
};

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
            <MemoryRouter><CheckoutPage /></MemoryRouter>
        </Provider>
    );
};

describe('CheckoutPage', () => {

    it('should show error when continue clicked without card data', async () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });

        const button = screen.getByText('Ver resumen');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/completa los datos de la tarjeta/i)).toBeInTheDocument();
        });
    });

    it('should go to summary when transactionId exists and card is filled', async () => {
        const store = configureStore({
            reducer: {
                products: productReducer,
                checkout: checkoutReducer,
                transaction: transactionReducer,
            },
            preloadedState: {
                products: { items: [], selected: mockProduct, loading: false, error: null },
                checkout: {
                    step: 'form',
                    customerId: 'cust-1',
                    transactionId: 'tx-1',
                    customerData: {
                        fullName: 'Juan', email: 'juan@test.com',
                        phone: '3001234567', address: 'Calle 1',
                        city: 'Bogotá', zipCode: '110111',
                    },
                    cardData: {
                        number: '4242424242424242', cardHolder: 'JUAN PEREZ',
                        expMonth: '12', expYear: '28', cvc: '123',
                        brand: 'VISA', lastFour: '4242',
                    },
                    selectedProduct: mockProduct,
                    fees: null,
                },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter><CheckoutPage /></MemoryRouter>
            </Provider>
        );

        const button = screen.getByText('Ver resumen');
        fireEvent.click(button);

        await waitFor(() => {
            expect(store.getState().checkout.step).toBe('summary');
        });
    });

    it('should redirect when no product selected', () => {
        const { container } = renderWithStore();
        expect(container.querySelector('header')).toBeNull();
    });

    it('should show card form section', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Datos de tarjeta')).toBeInTheDocument();
    });

    it('should show delivery form section', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Datos de entrega')).toBeInTheDocument();
    });

    it('should use selectedProduct from checkout when products.selected is null', () => {
        renderWithStore({
            products: { items: [], selected: null, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument();
    });

    it('should prefill delivery form with saved customer data', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form',
                customerId: 'cust-1',
                transactionId: null,
                customerData: {
                    fullName: 'Juan Pérez',
                    email: 'juan@test.com',
                    phone: '3001234567',
                    address: 'Calle 123',
                    city: 'Bogotá',
                    zipCode: '110111',
                },
                cardData: null,
                selectedProduct: mockProduct,
                fees: null,
            },
        });
        expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    });

    it('should render checkout form when product is selected', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Datos de pago')).toBeInTheDocument();
    });

    it('should show product name in checkout', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument();
    });

    it('should show total amount', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Total a pagar')).toBeInTheDocument();
    });

    it('should show summary backdrop when step is summary', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'summary', fees: {
                    productAmount: 350000, baseFee: 3000,
                    deliveryFee: 8000, totalAmount: 361000,
                },
                transactionId: 'tx-1', cardData: {
                    number: '4242424242424242', cardHolder: 'JUAN',
                    expMonth: '12', expYear: '28', cvc: '123',
                    brand: 'VISA', lastFour: '4242',
                },
                customerId: null, customerData: null, selectedProduct: mockProduct,
            },
        });
        expect(screen.getByText('Resumen del pago')).toBeInTheDocument();
    });

    it('should show ver resumen button', () => {
        renderWithStore({
            products: { items: [], selected: mockProduct, loading: false, error: null },
            checkout: {
                step: 'form', customerId: null, transactionId: null,
                customerData: null, cardData: null, selectedProduct: mockProduct, fees: null,
            },
        });
        expect(screen.getByText('Ver resumen')).toBeInTheDocument();
    });

    it('should call API and create transaction when form is fully valid', async () => {
        const { api } = require('../../services/api');
        api.post
            .mockResolvedValueOnce({ data: { id: 'cust-1', fullName: 'Juan' } })
            .mockResolvedValueOnce({
                data: {
                    id: 'tx-1', status: 'PENDING', paymentReference: 'REF-123',
                    productAmount: 350000, baseFee: 3000, deliveryFee: 8000, totalAmount: 361000,
                }
            });

        const store = configureStore({
            reducer: { products: productReducer, checkout: checkoutReducer, transaction: transactionReducer },
            preloadedState: {
                products: { items: [], selected: mockProduct, loading: false, error: null },
                checkout: {
                    step: 'form', customerId: null, transactionId: null,
                    customerData: {
                        fullName: 'Juan Pérez', email: 'juan@test.com',
                        phone: '3001234567', address: 'Calle 123',
                        city: 'Bogotá', zipCode: '110111',
                    },
                    cardData: {
                        number: '4242424242424242', cardHolder: 'JUAN PEREZ',
                        expMonth: '12', expYear: '28', cvc: '123',
                        brand: 'VISA', lastFour: '4242',
                    },
                    selectedProduct: mockProduct, fees: null,
                },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter><CheckoutPage /></MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText('Ver resumen'));

        await waitFor(() => {
            expect(store.getState().checkout.step).toBe('summary');
        });
    });

    it('should show validation errors when delivery form is incomplete', async () => {
        const store = configureStore({
            reducer: { products: productReducer, checkout: checkoutReducer, transaction: transactionReducer },
            preloadedState: {
                products: { items: [], selected: mockProduct, loading: false, error: null },
                checkout: {
                    step: 'form', customerId: null, transactionId: null,
                    customerData: null,
                    cardData: {
                        number: '4242424242424242', cardHolder: 'JUAN PEREZ',
                        expMonth: '12', expYear: '28', cvc: '123',
                        brand: 'VISA', lastFour: '4242',
                    },
                    selectedProduct: mockProduct, fees: null,
                },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter><CheckoutPage /></MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText('Ver resumen'));

        await waitFor(() => {
            expect(screen.getByText(/corrige los errores/i)).toBeInTheDocument();
        });
    });
});