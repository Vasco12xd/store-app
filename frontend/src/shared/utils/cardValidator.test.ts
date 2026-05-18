import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateExpiry,
} from './cardValidator';

describe('detectCardBrand', () => {
  it('should detect VISA when number starts with 4', () => {
    expect(detectCardBrand('4242424242424242')).toBe('VISA');
    expect(detectCardBrand('4111')).toBe('VISA');
  });

  it('should detect MASTERCARD when number starts with 5[1-5]', () => {
    expect(detectCardBrand('5254740428419472')).toBe('MASTERCARD');
    expect(detectCardBrand('5100')).toBe('MASTERCARD');
  });

  it('should return empty string for unknown brand', () => {
    expect(detectCardBrand('6011')).toBe('');
    expect(detectCardBrand('3782')).toBe('');
  });

  it('should handle empty string', () => {
    expect(detectCardBrand('')).toBe('');
  });
});

describe('formatCardNumber', () => {
  it('should format 16 digit number with spaces', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
  });

  it('should remove non-numeric characters', () => {
    expect(formatCardNumber('4242-4242-4242-4242')).toBe('4242 4242 4242 4242');
  });

  it('should limit to 16 digits', () => {
    expect(formatCardNumber('42424242424242421234')).toBe('4242 4242 4242 4242');
  });

  it('should handle partial input', () => {
    expect(formatCardNumber('4242')).toBe('4242');
    expect(formatCardNumber('42424')).toBe('4242 4');
  });
});

describe('formatExpiry', () => {
  it('should format expiry with slash', () => {
    expect(formatExpiry('1228')).toBe('12/28');
  });

  it('should handle partial input', () => {
    expect(formatExpiry('12')).toBe('12/');
    expect(formatExpiry('1')).toBe('1');
  });

  it('should limit to 4 digits', () => {
    expect(formatExpiry('12345')).toBe('12/34');
  });

  it('should remove non-numeric characters', () => {
    expect(formatExpiry('12/28')).toBe('12/28');
  });
});

describe('validateCardNumber', () => {
  it('should validate correct VISA number', () => {
    expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
  });

  it('should validate correct Mastercard number', () => {
    expect(validateCardNumber('5105 1051 0510 5100')).toBe(true);
  });

  it('should reject invalid number', () => {
    expect(validateCardNumber('1234 5678 9012 3456')).toBe(false);
  });

  it('should reject short number', () => {
    expect(validateCardNumber('4242')).toBe(false);
  });
});

describe('validateExpiry', () => {
  it('should validate future date', () => {
    expect(validateExpiry('12/99')).toBe(true);
  });

  it('should reject past date', () => {
    expect(validateExpiry('01/20')).toBe(false);
  });

  it('should reject invalid month', () => {
    expect(validateExpiry('13/28')).toBe(false);
    expect(validateExpiry('00/28')).toBe(false);
  });

  it('should reject incomplete expiry', () => {
    expect(validateExpiry('12')).toBe(false);
    expect(validateExpiry('')).toBe(false);
  });
});