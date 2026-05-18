import { render, screen, fireEvent } from '@testing-library/react';
import { DeliveryForm } from './DeliveryForm';

const mockData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
};

const mockOnChange = jest.fn();
const mockErrors = {};

describe('DeliveryForm', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should render all delivery fields', () => {
        render(<DeliveryForm data={mockData} onChange={mockOnChange} errors={mockErrors} />);
        expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('juan@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('3001234567')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Calle 123 #45-67')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Bogotá')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('110111')).toBeInTheDocument();
    });

    it('should call onChange when input changes', () => {
        render(<DeliveryForm data={mockData} onChange={mockOnChange} errors={mockErrors} />);
        const input = screen.getByPlaceholderText('Juan Pérez');
        fireEvent.change(input, { target: { value: 'Juan Pérez' } });
        expect(mockOnChange).toHaveBeenCalledWith('fullName', 'Juan Pérez');
    });

    it('should show error message when error exists and field is touched', () => {
        render(
            <DeliveryForm
                data={mockData}
                onChange={mockOnChange}
                errors={{ email: 'Email inválido' }}
            />
        );
        const input = screen.getByPlaceholderText('juan@email.com');
        fireEvent.blur(input);
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    it('should show green border when field is valid', () => {
        const validData = { ...mockData, email: 'juan@test.com' };
        render(<DeliveryForm data={validData} onChange={mockOnChange} errors={mockErrors} />);
        const input = screen.getByPlaceholderText('juan@email.com');
        fireEvent.blur(input);
        expect(input).toHaveClass('border-green-400');
    });

    it('should return null when data is undefined', () => {
        const { container } = render(
            <DeliveryForm data={undefined as any} onChange={mockOnChange} errors={mockErrors} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should show red border when error exists and field is touched', () => {
        render(
            <DeliveryForm
                data={mockData}
                onChange={mockOnChange}
                errors={{ fullName: 'Requerido' }}
            />
        );
        const input = screen.getByPlaceholderText('Juan Pérez');
        fireEvent.blur(input);
        expect(input).toHaveClass('border-red-400');
    });
});