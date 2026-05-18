import { CustomerData } from '../checkoutSlice';

interface Props {
  data: CustomerData;
  onChange: (field: keyof CustomerData, value: string) => void;
  errors: Partial<CustomerData>;
}

export const DeliveryForm = ({ data, onChange, errors }: Props) => {
    if (!data) return null;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Datos de entrega
      </h3>

      {[
        { field: 'fullName', label: 'NOMBRE COMPLETO', placeholder: 'Juan Pérez', type: 'text' },
        { field: 'email', label: 'CORREO ELECTRÓNICO', placeholder: 'juan@email.com', type: 'email' },
        { field: 'phone', label: 'TELÉFONO', placeholder: '3001234567', type: 'tel' },
        { field: 'address', label: 'DIRECCIÓN', placeholder: 'Calle 123 #45-67', type: 'text' },
        { field: 'city', label: 'CIUDAD', placeholder: 'Bogotá', type: 'text' },
        { field: 'zipCode', label: 'CÓDIGO POSTAL', placeholder: '110111', type: 'text' },
      ].map(({ field, label, placeholder, type }) => (
        <div key={field} className="mb-3">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
          <input
            type={type}
            value={data[field as keyof CustomerData]}
            onChange={(e) => onChange(field as keyof CustomerData, e.target.value)}
            placeholder={placeholder}
            className={`w-full border rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition
              ${errors[field as keyof CustomerData]
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-primary'}`}
          />
          {errors[field as keyof CustomerData] && (
            <p className="text-red-500 text-xs mt-1">{errors[field as keyof CustomerData]}</p>
          )}
        </div>
      ))}
    </div>
  );
};