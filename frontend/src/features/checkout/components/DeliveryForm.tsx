import { useState } from 'react';
import type { CustomerData } from '../checkoutSlice';

interface Props {
  data: CustomerData;
  onChange: (field: keyof CustomerData, value: string) => void;
  errors: Partial<CustomerData>;
}

const validators: Record<keyof CustomerData, (v: string) => string> = {
  fullName: (v) => !v.trim() ? 'El nombre es requerido' : v.trim().length < 3 ? 'Mínimo 3 caracteres' : '',
  email: (v) => !v.trim() ? 'El email es requerido' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email inválido' : '',
  phone: (v) => !v.trim() ? 'El teléfono es requerido' : !/^\+?[\d\s\-]{7,15}$/.test(v) ? 'Teléfono inválido' : '',
  address: (v) => !v.trim() ? 'La dirección es requerida' : '',
  city: (v) => !v.trim() ? 'La ciudad es requerida' : '',
  zipCode: (v) => !v.trim() ? 'El código postal es requerido' : v.length < 4 ? 'Mínimo 4 caracteres' : '',
};

export const DeliveryForm = ({ data, onChange, errors }: Props) => {
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerData, boolean>>>({});

  if (!data) return null;

  const handleBlur = (field: keyof CustomerData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getError = (field: keyof CustomerData) => {
    if (!touched[field]) return '';
    return errors[field] || validators[field](data[field]) || '';
  };

  const inputClass = (field: keyof CustomerData) => {
    const error = getError(field);
    const isValid = touched[field] && !error;
    return `w-full border rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition
      ${error
        ? 'border-red-400 bg-red-50 focus:border-red-400'
        : isValid
          ? 'border-green-400 bg-green-50 focus:border-green-400'
          : 'border-gray-200 focus:border-primary'}`;
  };

  const fields: { field: keyof CustomerData; label: string; placeholder: string; type: string }[] = [
    { field: 'fullName', label: 'NOMBRE COMPLETO', placeholder: 'Juan Pérez', type: 'text' },
    { field: 'email', label: 'CORREO ELECTRÓNICO', placeholder: 'juan@email.com', type: 'email' },
    { field: 'phone', label: 'TELÉFONO', placeholder: '3001234567', type: 'tel' },
    { field: 'address', label: 'DIRECCIÓN', placeholder: 'Calle 123 #45-67', type: 'text' },
    { field: 'city', label: 'CIUDAD', placeholder: 'Bogotá', type: 'text' },
    { field: 'zipCode', label: 'CÓDIGO POSTAL', placeholder: '110111', type: 'text' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Datos de entrega
      </h3>

      {fields.map(({ field, label, placeholder, type }) => (
        <div key={field} className="mb-3">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
          <input
            type={type}
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={placeholder}
            className={inputClass(field)}
          />
          {getError(field) && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              {getError(field)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};