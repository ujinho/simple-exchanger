import { Currency } from 'dinero.js';

export interface FxRates {
  base: Currency;
  date?: string;
  rates: { [key in Currency]?: number };
  error?: string;
}
