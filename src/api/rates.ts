import Axios from 'axios';
import { Currency } from 'dinero.js';
import { FxRates } from 'types/rates';

export const axios = Axios.create({
  baseURL: 'https://api.ratesapi.io/api/',
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

export const getLatestRates = (base: Currency, symbolsArray: ReadonlyArray<Currency>) => {
  const symbols = (symbolsArray && symbolsArray.join(',')) || '';
  return axios.get<FxRates>('latest', {
    params: {
      base,
      symbols,
    },
  });
};
