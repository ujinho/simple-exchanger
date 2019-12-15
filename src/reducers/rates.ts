import { getLatestRates } from 'api/rates';
import { POLL_INTERVAL } from 'const';
import { StoreonEvents, Module } from 'storeon';
import { Currency } from 'dinero.js';
import { FxRates } from 'types/rates';

export type RatesState = {
  base: Currency;
  symbols: ReadonlyArray<Currency>;
  pollInterval: number;
  rates: FxRates;
  intervalId: number;
};

type PollPayload = {
  base: Currency;
  symbols: ReadonlyArray<Currency>;
};

export enum RatesEventName {
  Set = 'rates/set',
  Poll = 'rates/poll',
  SetIntervalId = 'rates/set-interval-id',
}

export interface RatesEvents extends StoreonEvents<RatesState> {
  [RatesEventName.Set]: Partial<RatesState>;
  [RatesEventName.Poll]: PollPayload;
  [RatesEventName.SetIntervalId]: number;
}

const initialState: RatesState = {
  base: undefined,
  symbols: [],
  pollInterval: POLL_INTERVAL,
  rates: undefined,
  intervalId: undefined,
};

const ratesModule: Module<RatesState, RatesEvents> = store => {
  store.on('@init', () => initialState);

  store.on(RatesEventName.SetIntervalId, (_, intervalId) => ({
    intervalId,
  }));

  store.on(RatesEventName.Set, (_, nextState) => nextState);

  store.on(RatesEventName.Poll, (_, { base, symbols }) => {
    const { pollInterval, intervalId } = store.get();

    if (intervalId) {
      clearInterval(intervalId);
    }

    if (!base || !symbols) {
      return {};
    }

    const action = () => {
      return getLatestRates(base, symbols)
        .then(response => {
          const rates = response?.data;
          const nextState = {
            symbols,
            base,
            rates,
          };
          return store.dispatch(RatesEventName.Set, nextState);
        })
        .catch(() => {
          /* error handling should be here */
        });
    };

    action();
    const nextIntervalId = window.setInterval(action, pollInterval);
    store.dispatch(RatesEventName.SetIntervalId, nextIntervalId);
  });
};

export default ratesModule;
