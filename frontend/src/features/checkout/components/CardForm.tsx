import { useState } from 'react';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { setCardData, CardData } from '../checkoutSlice';
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateExpiry,
} from '../../../shared/utils/cardValidator';

export const CardForm = () => {
  const dispatch = useAppDispatch();

  const [number, setNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brand = detectCardBrand(number);

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'number':
        if (!value.trim()) error = 'El número de tarjeta es requerido';
        else if (!validateCardNumber(value)) error = 'Número de tarjeta inválido';
        break;
      case 'cardHolder':
        if (!value.trim()) error = 'El nombre del titular es requerido';
        else if (value.trim().length < 5) error = 'Mínimo 5 caracteres';
        break;
      case 'expiry':
        if (!value.trim()) error = 'La fecha de vencimiento es requerida';
        else if (!validateExpiry(value)) error = 'Fecha inválida o expirada';
        break;
      case 'cvc':
        if (!value.trim()) error = 'El CVC es requerido';
        else if (value.length < 3) error = 'CVC debe tener mínimo 3 dígitos';
        break;
    }
    return error;
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleNumberChange = (val: string) => {
    const formatted = formatCardNumber(val);
    setNumber(formatted);
    if (touched.number) {
      setErrors((prev) => ({ ...prev, number: validateField('number', formatted) }));
    }
    updateStore(formatted, cardHolder, expiry, cvc);
  };

  const handleCardHolderChange = (val: string) => {
    const upper = val.toUpperCase();
    setCardHolder(upper);
    if (touched.cardHolder) {
      setErrors((prev) => ({ ...prev, cardHolder: validateField('cardHolder', upper) }));
    }
    updateStore(number, upper, expiry, cvc);
  };

  const handleExpiryChange = (val: string) => {
    const formatted = formatExpiry(val);
    setExpiry(formatted);
    if (touched.expiry) {
      setErrors((prev) => ({ ...prev, expiry: validateField('expiry', formatted) }));
    }
    updateStore(number, cardHolder, formatted, cvc);
  };

  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    setCvc(clean);
    if (touched.cvc) {
      setErrors((prev) => ({ ...prev, cvc: validateField('cvc', clean) }));
    }
    updateStore(number, cardHolder, expiry, clean);
  };

  const updateStore = (num: string, holder: string, exp: string, cv: string) => {
    const clean = num.replace(/\s/g, '');
    const [expMonth, expYear] = exp.split('/');
    if (clean.length === 16 && holder.length >= 5 && exp.length === 5 && cv.length >= 3) {
      const data: CardData = {
        number: clean,
        cardHolder: holder,
        expMonth: expMonth || '',
        expYear: expYear || '',
        cvc: cv,
        brand: detectCardBrand(clean),
        lastFour: clean.slice(-4),
      };
      dispatch(setCardData(data));
    }
  };

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition
    ${touched[field] && errors[field]
      ? 'border-red-400 bg-red-50 focus:border-red-400'
      : touched[field] && !errors[field]
        ? 'border-green-400 bg-green-50 focus:border-green-400'
        : 'border-gray-200 focus:border-primary'}`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Datos de tarjeta
      </h3>

      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">NÚMERO DE TARJETA</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={number}
            onChange={(e) => handleNumberChange(e.target.value)}
            onBlur={() => handleBlur('number', number)}
            placeholder="0000 0000 0000 0000"
            className={inputClass('number') + ' pr-16'}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {brand === 'VISA' && (
              <span className="text-blue-700 font-bold text-sm italic">VISA</span>
            )}
            {brand === 'MASTERCARD' && (
              <div className="flex">
                <div className="w-5 h-5 bg-red-500 rounded-full opacity-90" />
                <div className="w-5 h-5 bg-yellow-400 rounded-full -ml-2 opacity-90" />
              </div>
            )}
          </div>
        </div>
        {touched.number && errors.number && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            {errors.number}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">NOMBRE DEL TITULAR</label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => handleCardHolderChange(e.target.value)}
          onBlur={() => handleBlur('cardHolder', cardHolder)}
          placeholder="NOMBRE APELLIDO"
          className={inputClass('cardHolder')}
        />
        {touched.cardHolder && errors.cardHolder && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            {errors.cardHolder}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">VENCIMIENTO</label>
          <input
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            onBlur={() => handleBlur('expiry', expiry)}
            placeholder="MM/AA"
            className={inputClass('expiry')}
          />
          {touched.expiry && errors.expiry && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              {errors.expiry}
            </p>
          )}
        </div>

        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">CVC</label>
          <input
            type="text"
            inputMode="numeric"
            value={cvc}
            onChange={(e) => handleCvcChange(e.target.value)}
            onBlur={() => handleBlur('cvc', cvc)}
            placeholder="123"
            className={inputClass('cvc')}
          />
          {touched.cvc && errors.cvc && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              {errors.cvc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};