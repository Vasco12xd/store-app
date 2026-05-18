export type CardBrand = 'VISA' | 'MASTERCARD' | '';

export const detectCardBrand = (number: string): CardBrand => {
  const clean = number.replace(/\s/g, '');
  if (/^4/.test(clean)) return 'VISA';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'MASTERCARD';
  return '';
};

export const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2);
  return clean;
};

export const validateCardNumber = (number: string): boolean => {
  const clean = number.replace(/\s/g, '');
  if (clean.length !== 16) return false;
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    let digit = parseInt(clean[i]);
    if ((clean.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split('/');
  if (!month || !year || year.length !== 2) return false;
  const m = parseInt(month);
  const y = parseInt('20' + year);
  if (m < 1 || m > 12) return false;
  const now = new Date();
  const expDate = new Date(y, m - 1);
  return expDate > now;
};