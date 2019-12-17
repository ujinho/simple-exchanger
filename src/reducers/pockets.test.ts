import Dinero from 'dinero.js';
import { getPreConvertReducer, getConvertReducer } from './pockets';

const rates = {
  base: 'USD',
  date: '2019-05-06',
  rates: {
    EUR: 0.9,
    GBP: 0.8,
  },
};

const store = {
  dispatch: jest.fn(),
  on: jest.fn(),
  get: jest.fn(),
};

// @ts-ignore
const preConvert = getPreConvertReducer(store);
// @ts-ignore
const convert = getConvertReducer(store);

beforeEach(() => {
  // @ts-ignore
  Dinero.globalExchangeRatesApi.endpoint = new Promise(resolve => resolve(rates));
});

describe('preConvert', () => {
  beforeEach(() => {
    this.initialState = {
      to: undefined,
      from: undefined,
      amount: 0,
      pockets: {
        USD: Dinero({ amount: 50000, currency: 'USD' }),
        EUR: Dinero({ amount: 50000, currency: 'EUR' }),
        GBP: Dinero({ amount: 50000, currency: 'GBP' }),
      },
    };
  });

  it('should set error message when no rates specified', () => {
    // @ts-ignore
    Dinero.globalExchangeRatesApi.endpoint = Promise.resolve({});
    return preConvert(this.initialState, {
      amount: 10000,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result).toEqual({
        error: 'No rate was found for the destination currency "EUR".',
      });
    });
  });

  it(`should set amount when it's === 0`, () => {
    preConvert(this.initialState, {
      amount: 0,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result).toEqual({});
    });
  });

  it('should not set any fields when amount is not specified', () => {
    return preConvert(this.initialState, {
      amount: undefined,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result).toEqual({});
    });
  });

  it('should set only amount field when destination currency is not specified or specified incorrectly', () => {
    const amount = 10000;
    return Promise.all([
      preConvert(this.initialState, {
        amount,
        from: 'USD',
        to: undefined,
      }).then(result => {
        expect(result).toEqual({ amount });
      }),
      preConvert(this.initialState, {
        amount: 10000,
        from: 'USD',
        to: 'RUB',
      }).then(result => {
        expect(result).toEqual({ amount });
      }),
    ]);
  });

  it('should set only amount field when source currency is not specified or specified incorrectly', () => {
    const amount = 10000;
    return Promise.all([
      preConvert(this.initialState, {
        amount,
        from: undefined,
        to: 'USD',
      }).then(result => {
        expect(result).toEqual({ amount });
      }),
      preConvert(this.initialState, {
        amount: 10000,
        from: 'RUB',
        to: 'USD',
      }).then(result => {
        expect(result).toEqual({ amount });
      }),
    ]);
  });

  it('should set only amount when source and destination currencies are equal', () => {
    const amount = 10000;
    return preConvert(this.initialState, {
      amount,
      from: 'USD',
      to: 'USD',
    }).then(result => {
      expect(result).toEqual({ amount });
    });
  });

  it('should return correct subtrahend and pre-converted values', () => {
    return preConvert(this.initialState, {
      amount: 10000,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result.subtrahend.getCurrency()).toEqual('USD');
      expect(result.subtrahend.getAmount()).toEqual(10000);
      expect(result.converted.getCurrency()).toEqual('EUR');
      expect(result.converted.getAmount()).toEqual(9000);
    });
  });

  it('should return correct subtrahend and pre-converted values for negative amount', () => {
    return preConvert(this.initialState, {
      amount: -10000,
      from: 'USD',
      to: 'GBP',
    }).then(result => {
      expect(result.subtrahend.getCurrency()).toEqual('USD');
      expect(result.subtrahend.getAmount()).toEqual(-10000);
      expect(result.converted.getCurrency()).toEqual('GBP');
      expect(result.converted.getAmount()).toEqual(-8000);
    });
  });
});

describe('convert', () => {
  beforeEach(() => {
    this.initialState = {
      to: undefined,
      from: undefined,
      amount: 0,
      pockets: {
        USD: Dinero({ amount: 50000, currency: 'USD' }),
        EUR: Dinero({ amount: 50000, currency: 'EUR' }),
        GBP: Dinero({ amount: 50000, currency: 'GBP' }),
      },
    };
  });

  it('should set error message when no rates specified', () => {
    // @ts-ignore
    Dinero.globalExchangeRatesApi.endpoint = Promise.resolve({});
    return convert(this.initialState, {
      amount: 10000,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result).toEqual({
        error: 'No rate was found for the destination currency "EUR".',
      });
    });
  });

  it('should not update any fields when amount is not specified', () => {
    return Promise.all([
      convert(this.initialState, {
        amount: 0,
        from: 'USD',
        to: 'EUR',
      }).then(result => {
        expect(result).toEqual({});
      }),
      convert(this.initialState, {
        amount: undefined,
        from: 'USD',
        to: 'EUR',
      }).then(result => {
        expect(result).toEqual({});
      }),
    ]);
  });

  it('should not update any fields when destination currency is not specified or specified incorrectly', () => {
    return Promise.all([
      convert(this.initialState, {
        amount: 10000,
        from: 'USD',
        to: undefined,
      }).then(result => {
        expect(result).toEqual({});
      }),
      convert(this.initialState, {
        amount: 10000,
        from: 'USD',
        to: 'RUB',
      }).then(result => {
        expect(result).toEqual({});
      }),
    ]);
  });

  it('should not update any fields when source currency is not specified or specified incorrectly', () => {
    return Promise.all([
      convert(this.initialState, {
        amount: 10000,
        from: undefined,
        to: 'USD',
      }).then(result => {
        expect(result).toEqual({});
      }),
      convert(this.initialState, {
        amount: 10000,
        from: 'RUB',
        to: 'USD',
      }).then(result => {
        expect(result).toEqual({});
      }),
    ]);
  });

  it('should not update any fields when source and destination currencies are equal', () => {
    return convert(this.initialState, {
      amount: 10000,
      from: 'USD',
      to: 'USD',
    }).then(result => {
      expect(result).toEqual({});
    });
  });

  it('should not touch inactive pocket', () => {
    convert(this.initialState, {
      amount: 10000,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result.pockets.GBP.getAmount()).toEqual(this.initialState.pockets.GBP.getAmount());
    });
  });

  it('should set correct source and destination pockets amounts', () => {
    return convert(this.initialState, {
      amount: 10000,
      from: 'USD',
      to: 'EUR',
    }).then(result => {
      expect(result.pockets.USD.getAmount()).toEqual(40000);
      expect(result.pockets.EUR.getAmount()).toEqual(59000);
    });
  });

  it('should set correct subtrahend and pre-converted values for negative amount', () => {
    return convert(this.initialState, {
      amount: -10000,
      from: 'USD',
      to: 'GBP',
    }).then(result => {
      expect(result.pockets.USD.getAmount()).toEqual(60000);
      expect(result.pockets.GBP.getAmount()).toEqual(42000);
    });
  });
});
