import { Currency } from 'dinero.js';

export const POLL_INTERVAL_MIN = 1000;

export const POLL_INTERVAL = 10000;

export const SYMBOLS: ReadonlyArray<Currency> = ['USD', 'EUR', 'GBP'];

export const DEFAULT_BASE_SYMBOL = 'USD';

export const DEFAULT_SYMBOLS: ReadonlyArray<Currency> = ['EUR', 'GBP'];

export const DEFAULT_CURRENCY_FORMAT = 'USD0.00';
