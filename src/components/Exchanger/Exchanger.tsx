import React, { useCallback, useMemo, useEffect } from 'react';

import { useStoreon } from 'reducers/storeon';

import Dinero, { Currency } from 'dinero.js';
import { cn } from '@bem-react/classname';
import { SYMBOLS } from 'const';

import PocketList from './PocketList';

import { AppState } from '../../store';

import './Exchanger.styl';
import { PocketsEventName } from 'reducers/pockets';
import { RatesEventName } from 'reducers/rates';

const exchangerClassName = cn('exchanger');

export default () => {
  const { dispatch, from, to, amount, rates, pockets, subtrahend, converted } = useStoreon<
    AppState
  >('from', 'to', 'amount', 'rates', 'pockets', 'subtrahend', 'converted');

  const isConvertDisabled = amount > pockets[from]?.getAmount() || !from || !to || !amount;

  useEffect(() => {
    const symbols = SYMBOLS.filter(sym => sym !== from);
    dispatch(RatesEventName.Poll, { base: from, symbols });
  }, [from]);

  useEffect(() => {
    // @ts-ignore
    Dinero.globalExchangeRatesApi?.endpoint = new Promise(resolve => resolve(rates));
  }, [rates]);

  const onSelectPocket = useCallback(
    (currency: Currency) => {
      if (to && to === currency) {
        dispatch(PocketsEventName.Set, {
          from: currency,
          to: undefined,
        });
      } else if (from && from !== currency) {
        dispatch(PocketsEventName.Set, { to: currency });
      } else {
        dispatch(PocketsEventName.Set, { from: currency });
      }
    },
    [from, to],
  );

  useEffect(() => {
    if (!from || !to || !amount) {
      return;
    }
    if (!isConvertDisabled) {
      dispatch(PocketsEventName.PreConvert, { from, to, amount });
    } else {
      dispatch(PocketsEventName.Set, { subtrahend: null, converted: null });
    }
  }, [from, to, amount, isConvertDisabled]);

  const onSetAmount = useCallback(e => {
    const value = Math.round(parseFloat(e.currentTarget.value) * 10000) / 100;
    dispatch(PocketsEventName.Set, { amount: value });
  }, []);

  const onConvert = useCallback(() => {
    dispatch(PocketsEventName.Convert, { from, to, amount });
  }, [from, to, amount]);

  const onReset = useCallback(() => {
    dispatch(PocketsEventName.Reset);
  }, []);

  const pocketsAsArray: ReadonlyArray<Dinero.Dinero> = useMemo(() => Object.values(pockets), [
    pockets,
  ]);

  const max = pockets[from]?.divide(100).getAmount() || 500;

  return (
    <div className={exchangerClassName()}>
      <div data-testid="exchanger-hint" className={exchangerClassName('hint')}>
        {!from && 'Select source pocket'}
        {from && !to && 'Select destination pocket'}
        {from && to && !amount && 'Set amount to convert'}
      </div>

      <PocketList
        from={from}
        to={to}
        rates={rates?.rates}
        subtrahend={subtrahend}
        converted={converted}
        pockets={pocketsAsArray}
        data-testid="pocket-list"
        onSelectPocket={onSelectPocket}
      />

      <div className={exchangerClassName('input-row')}>
        <input
          min={-max}
          max={max}
          type="number"
          step="0.05"
          pattern="[0-9]+([,\.][0-9]+)?"
          placeholder="0.00"
          className={exchangerClassName('input')}
          data-testid="amount-input"
          onChange={onSetAmount}
        />
        {from}
      </div>

      <div className={exchangerClassName('buttons')}>
        <button
          className={exchangerClassName('button', { disabled: isConvertDisabled })}
          disabled={isConvertDisabled}
          data-testid="convert-button"
          onClick={onConvert}
        >
          Convert
        </button>

        <button
          className={exchangerClassName('button', { outlined: true })}
          data-testid="reset-button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
