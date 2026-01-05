import {
  convertCurrencySync,
  getCurrencySymbol,
  formatCurrency,
  getCachedRate,
  clearRateCache,
} from '@/lib/currency/converter';
import type { Currency } from '@/lib/currency/converter';

describe('Currency Converter', () => {
  beforeEach(() => {
    clearRateCache();
  });

  describe('convertCurrencySync', () => {
    it('should return the same amount for the same currency', () => {
      expect(convertCurrencySync(100, 'USD', 'USD')).toBe(100);
      expect(convertCurrencySync(50, 'EUR', 'EUR')).toBe(50);
    });

    it('should convert USD to EUR using fallback rate', () => {
      const result = convertCurrencySync(100, 'USD', 'EUR');
      // Fallback rate is 0.92, so 100 USD = 92 EUR
      expect(result).toBeCloseTo(92, 1);
    });

    it('should convert EUR to USD using fallback rate', () => {
      const result = convertCurrencySync(100, 'EUR', 'USD');
      // 100 EUR / 0.92 = ~108.70 USD
      expect(result).toBeCloseTo(108.70, 1);
    });

    it('should use provided rate when available', () => {
      const customRate = 0.95;
      const result = convertCurrencySync(100, 'USD', 'EUR', customRate);
      expect(result).toBe(95);
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbol for USD', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
    });

    it('should return correct symbol for EUR', () => {
      expect(getCurrencySymbol('EUR')).toBe('€');
    });

    it('should return correct symbol for GBP', () => {
      expect(getCurrencySymbol('GBP')).toBe('£');
    });

    it('should return correct symbol for JPY', () => {
      expect(getCurrencySymbol('JPY')).toBe('¥');
    });

    it('should return currency code for unknown currency', () => {
      expect(getCurrencySymbol('UNKNOWN' as Currency)).toBe('UNKNOWN');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('should format EUR correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });

    it('should format JPY without decimals', () => {
      expect(formatCurrency(1234.56, 'JPY')).toBe('¥1,235');
    });

    it('should format large numbers with thousand separators', () => {
      expect(formatCurrency(1234567.89, 'USD')).toBe('$1,234,567.89');
    });

    it('should format small numbers correctly', () => {
      expect(formatCurrency(5.5, 'USD')).toBe('$5.50');
    });
  });

  describe('getCachedRate', () => {
    it('should return 1.0 for same currency', () => {
      expect(getCachedRate('USD', 'USD')).toBe(1.0);
    });

    it('should return null when rate is not cached', () => {
      expect(getCachedRate('USD', 'EUR')).toBeNull();
    });
  });

  describe('clearRateCache', () => {
    it('should clear the cache', () => {
      clearRateCache();
      expect(getCachedRate('USD', 'EUR')).toBeNull();
    });
  });
});

