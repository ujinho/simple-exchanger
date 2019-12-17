import React from 'react';

import Dinero from 'dinero.js';

import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react/cleanup-after-each';

import { mockUseStoreon } from 'utils/test';

import Exchanger from './Exchanger';
import { FxRates } from 'types/rates';
import { PocketsEventName } from 'reducers/pockets';
import { RatesEventName } from 'reducers/rates';

const INITIAL_AMOUNT = 500;
const INITIAL_POCKET_AMOUNT = 5000;

const dispatch = jest.fn();

const rates: FxRates = {
  base: 'GBP',
  rates: {
    EUR: 1.1,
    USD: 1.2,
  },
};

const from = 'GBP';
const to = 'USD';
const amount = INITIAL_AMOUNT;
const pockets = {
  USD: Dinero({ amount: INITIAL_POCKET_AMOUNT, currency: 'USD' }),
  EUR: Dinero({ amount: INITIAL_POCKET_AMOUNT, currency: 'EUR' }),
  GBP: Dinero({ amount: INITIAL_POCKET_AMOUNT, currency: 'GBP' }),
};
const subtrahend = Dinero({ currency: from, amount });
const converted = Dinero({ currency: from, amount: amount * 1.2 });

const defaultState = { dispatch, rates, to, from, amount, pockets, subtrahend, converted };

describe('<Exchanger /> spec', () => {
  beforeEach(() => {
    mockUseStoreon(defaultState);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without crasing', () => {
    const element = render(<Exchanger />);
    expect(element).toMatchSnapshot();
  });

  it('convert button should be disabled if no source pocket selected', () => {
    mockUseStoreon({
      ...defaultState,
      from: undefined,
    });
    const element = render(<Exchanger />);
    expect(element.getByTestId('convert-button')).toBeDisabled();
  });

  it('convert button should be disabled if no destination pocket selected', () => {
    mockUseStoreon({
      ...defaultState,
      to: undefined,
    });

    const element = render(<Exchanger />);
    expect(element.getByTestId('convert-button')).toBeDisabled();
  });

  it('convert button should be disabled if amount is not specified', () => {
    mockUseStoreon({
      ...defaultState,
      amount: 0,
    });
    const element = render(<Exchanger />);
    expect(element.getByTestId('convert-button')).toBeDisabled();
  });

  it('convert button should be disabled if amount greater than source pocket amount', () => {
    mockUseStoreon({
      ...defaultState,
      amount: INITIAL_POCKET_AMOUNT + 1,
    });
    const element = render(<Exchanger />);
    expect(element.getByTestId('convert-button')).toBeDisabled();
  });

  it('should enable convert button when all fields are set', () => {
    mockUseStoreon({
      ...defaultState,
    });
    const element = render(<Exchanger />);
    expect(element.getByTestId('convert-button')).toBeEnabled();
  });

  it('should correctly render all pockets', () => {
    mockUseStoreon({
      ...defaultState,
    });
    const element = render(<Exchanger />);
    expect(element.getByTestId('pocket-USD')).toHaveTextContent('USD 50.00');
    expect(element.getByTestId('pocket-USD-converted-value')).toHaveTextContent('+6');
    expect(element.getByTestId('pocket-USD-rate')).toHaveTextContent('1.2');

    expect(element.getByTestId('pocket-GBP')).toHaveTextContent('GBP 50.00');
    expect(element.getByTestId('pocket-GBP-converted-value')).toHaveTextContent('-5');
    expect(element.getByTestId('pocket-GBP-rate')).toHaveTextContent('1.00');
  });

  it('should pre-convert to display substrahend and converted values', () => {
    render(<Exchanger />);

    expect(dispatch).toHaveBeenLastCalledWith(PocketsEventName.PreConvert, {
      amount,
      from,
      to,
    });
  });

  it('should save proper amount value to store', () => {
    const element = render(<Exchanger />);

    fireEvent.change(element.getByTestId('amount-input'), {
      target: {
        value: 11.5612,
      },
    });

    expect(dispatch).toHaveBeenLastCalledWith(PocketsEventName.Set, {
      amount: 1156.12,
    });
  });

  it('should convert with proper values', () => {
    mockUseStoreon({ ...defaultState, amount: 400, from: 'EUR', to: 'USD' });

    const element = render(<Exchanger />);

    fireEvent.click(element.getByTestId('convert-button'));

    expect(dispatch).toHaveBeenLastCalledWith(PocketsEventName.Convert, {
      amount: 400,
      from: 'EUR',
      to: 'USD',
    });
  });

  it('should be able to reset values', () => {
    mockUseStoreon({ ...defaultState, amount: 400, from: 'EUR', to: 'USD' });

    const element = render(<Exchanger />);

    fireEvent.click(element.getByTestId('reset-button'));

    expect(dispatch).toHaveBeenLastCalledWith(PocketsEventName.Reset);
  });

  it('should poll rates', () => {
    render(<Exchanger />);

    expect(dispatch).toHaveBeenCalledWith(RatesEventName.Poll, {
      base: 'GBP',
      symbols: expect.arrayContaining(['USD', 'EUR']),
    });
  });
});
