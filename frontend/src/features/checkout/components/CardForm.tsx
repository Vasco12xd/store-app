import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAppDispatch';
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
  const saved = useAppSelector((state) => state.checkout.cardData);

  const [number, setNumber] = useState(saved?.number ? formatCardNumber(saved.number) : '');
  const [cardHolder, setCardHolder] = useState(saved?.cardHolder || '');
  const [expiry, setExpiry] = useState(
    saved?.expMonth && saved?.expYear ? `${saved.expMonth}/${saved.expYear}` : ''
  );
  const [cvc, setCvc] = useState(saved?.cvc || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brand = detectCardBrand(number);

  useEffect(() => {
    const clean = number.replace(/\s/g, '');
    const [expMonth, expYear] = expiry.split('/');
    if (clean && cardHolder && expiry && cvc) {
      const data: CardData = {
        number: clean,
        cardHolder,
        expMonth: expMonth || '',
        expYear: expYear || '',
        cvc,
        brand,
        lastFour: clean.slice(-4),
      };
      dispatch(setCardData(data));
    }
  }, [number, cardHolder, expiry, cvc]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!validateCardNumber(number)) newErrors.number = 'Número de tarjeta inválido';
    if (!cardHolder.trim() || cardHolder.length < 5) newErrors.cardHolder = 'Ingresa el nombre del titular';
    if (!validateExpiry(expiry)) newErrors.expiry = 'Fecha de expiración inválida';
    if (cvc.length < 3) newErrors.cvc = 'CVC inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Datos de tarjeta
      </h3>

      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          NÚMERO DE TARJETA
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={number}
            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
            className={`w-full border rounded-xl px-4 py-3 pr-16 text-gray-900 text-sm outline-none transition
              ${errors.number ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
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
        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
      </div>

      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          NOMBRE DEL TITULAR
        </label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
          placeholder="NOMBRE APELLIDO"
          className={`w-full border rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition uppercase
            ${errors.cardHolder ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
        />
        {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            VENCIMIENTO
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            className={`w-full border rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition
              ${errors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
          />
          {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
        </div>

        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            CVC
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            className={`w-full border rounded-xl px-4 py-3 text-gray-900 text-sm outline-none transition
              ${errors.cvc ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}`}
          />
          {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
        </div>
      </div>
    </div>
  );
};