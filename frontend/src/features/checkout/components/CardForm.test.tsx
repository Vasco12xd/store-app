import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CardForm } from './CardForm';
import checkoutReducer from '../checkoutSlice';
import transactionReducer from '../../transaction/transactionSlice';
import productReducer from '../../product/productSlice';

const renderWithStore = () => {
    const store = configureStore({
        reducer: {
            checkout: checkoutReducer,
            transaction: transactionReducer,
            products: productReducer,
        },
    });
    return { store, ...render(<Provider store={store}><CardForm /></Provider>) };
};

describe('CardForm', () => {
    it('should render all card fields', () => {
        renderWithStore();
        expect(screen.getByPlaceholderText('0000 0000 0000 0000')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('NOMBRE APELLIDO')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('123')).toBeInTheDocument();
    });

    it('should show VISA logo when number starts with 4', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('0000 0000 0000 0000');
        fireEvent.change(input, { target: { value: '4242' } });
        expect(screen.getByText('VISA')).toBeInTheDocument();
    });

    it('should format card number with spaces', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('0000 0000 0000 0000');
        fireEvent.change(input, { target: { value: '4242424242424242' } });
        expect(input).toHaveValue('4242 4242 4242 4242');
    });

    it('should show error on blur when card number is invalid', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('0000 0000 0000 0000');
        fireEvent.change(input, { target: { value: '1234' } });
        fireEvent.blur(input);
        expect(screen.getByText(/inválido/i)).toBeInTheDocument();
    });

    it('should show error on blur when card holder is too short', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('NOMBRE APELLIDO');
        fireEvent.change(input, { target: { value: 'AB' } });
        fireEvent.blur(input);
        expect(screen.getByText(/caracteres/i)).toBeInTheDocument();
    });

    it('should convert card holder to uppercase', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('NOMBRE APELLIDO');
        fireEvent.change(input, { target: { value: 'juan perez' } });
        expect(input).toHaveValue('JUAN PEREZ');
    });

    it('should format expiry with slash', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('MM/AA');
        fireEvent.change(input, { target: { value: '1228' } });
        expect(input).toHaveValue('12/28');
    });

    it('should limit CVC to 4 digits', () => {
        renderWithStore();
        const input = screen.getByPlaceholderText('123');
        fireEvent.change(input, { target: { value: '12345' } });
        expect(input).toHaveValue('1234');
    });
});