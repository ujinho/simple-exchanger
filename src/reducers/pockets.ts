import Dinero, { Currency } from 'dinero.js';
import { StoreonEvents, Module, Store } from 'storeon';

type PocketsMap = { [key in Currency]?: Dinero.Dinero };

export interface PocketsState {
  to: Currency;
  from: Currency;
  amount: number;
  pockets: PocketsMap;
  converted: Dinero.Dinero;
  subtrahend: Dinero.Dinero;
  error: string;
}

export type ConvertPayload = {
  amount: number;
  from: Currency;
  to: Currency;
};

export enum PocketsEventName {
  Set = 'pockets/set',
  Reset = 'pockets/reset',
  PreConvert = 'pockets/pre-convert',
  Convert = 'pockets/convert',
}

export interface PocketsEvents extends StoreonEvents<PocketsState> {
  [PocketsEventName.Set]: Partial<PocketsState>;
  [PocketsEventName.Reset]: Partial<PocketsState>;
  [PocketsEventName.Convert]: ConvertPayload;
  [PocketsEventName.PreConvert]: ConvertPayload;
}

export type PocketsStore = Store<PocketsState, PocketsEvents>;

type ConvertReducer<R> = (state: PocketsState, payload: ConvertPayload) => Promise<R> & R;

type ConvertReducerCreator = (store: PocketsStore) => ConvertReducer<Partial<PocketsState>>;

const pocketsInitial: PocketsMap = {
  USD: Dinero({ amount: 50000, currency: 'USD' }),
  EUR: Dinero({ amount: 50000, currency: 'EUR' }),
  GBP: Dinero({ amount: 50000, currency: 'GBP' }),
};

export const initialState: PocketsState = {
  to: undefined,
  from: undefined,
  amount: 0,
  converted: undefined,
  subtrahend: undefined,
  error: undefined,
  pockets: pocketsInitial,
};

export const getPreConvertReducer: ConvertReducerCreator = store => (
  state,
  { amount, from, to },
) => {
  if (amount == null) {
    return Promise.resolve({});
  }

  if (from === to) {
    const stateChanges = { amount };
    store.dispatch(PocketsEventName.Set, stateChanges);
    return Promise.resolve(stateChanges);
  }

  const pocketFrom = state.pockets[from];
  const pocketTo = state.pockets[to];

  if (!pocketFrom || !pocketTo) {
    const stateChanges = { amount };
    store.dispatch(PocketsEventName.Set, { amount });
    return Promise.resolve(stateChanges);
  }

  const subtrahend = Dinero({ currency: from, amount });
  return subtrahend
    .convert(to)
    .then(converted => {
      const stateChanges = {
        to,
        from,
        amount,
        converted,
        subtrahend,
      };
      store.dispatch(PocketsEventName.Set, stateChanges);
      return Promise.resolve(stateChanges);
    })
    .catch(e => {
      /* error handling should be placed here */
      return Promise.resolve({
        error: e.message,
      });
    });
};

export const getConvertReducer: ConvertReducerCreator = store => (state, { amount, from, to }) => {
  if (!from || !to || !amount) {
    return Promise.resolve({});
  }

  if (from === to) {
    return Promise.resolve({});
  }

  const pocketFrom = state.pockets[from];
  const pocketTo = state.pockets[to];

  if (!pocketFrom || !pocketTo) {
    return Promise.resolve({});
  }

  const subtrahend = Dinero({ currency: from, amount });
  const substracted = pocketFrom && pocketFrom.subtract(subtrahend);

  if (!substracted) return Promise.resolve({});

  return subtrahend
    .convert(to)
    .then(converted => {
      const stateChanges = {
        to,
        from,
        amount,
        pockets: {
          ...state.pockets,
          [from]: substracted,
          [to]: pocketTo.add(converted),
        },
      };
      store.dispatch(PocketsEventName.Set, stateChanges);
      return Promise.resolve(stateChanges);
    })
    .catch(e => {
      return Promise.resolve({
        error: e.message,
      });
    });
};

const pocketsModule: Module<PocketsState, PocketsEvents> = store => {
  store.on('@init', () => initialState);

  store.on(PocketsEventName.Reset, (_1, _2) => {
    return { pockets: pocketsInitial };
  });

  store.on(PocketsEventName.Set, (_, stateChanges) => {
    return stateChanges;
  });

  store.on(PocketsEventName.PreConvert, getPreConvertReducer(store));

  store.on(PocketsEventName.Convert, getConvertReducer(store));
};

export default pocketsModule;
