import React, { memo } from 'react';
import { Currency } from 'dinero.js';
import { cn } from '@bem-react/classname';

import './Pocket.styl';

export interface PocketProps {
  currency: Currency;
  amount: string;
  rate: number;
  converted: number;
  asSource: boolean;
  asDestination: boolean;
  onSelect: (currency: Currency) => void;
}

const pocketClassName = cn('pocket');

const Pocket = ({
  currency,
  amount,
  rate,
  converted,
  asSource,
  asDestination,
  onSelect,
}: PocketProps) => {
  const className = pocketClassName({
    source: asSource,
    destination: asDestination,
  });

  const roundedRate = rate && Math.round(rate * 100) / 100;
  const roundedConverted = converted && Math.abs(Math.round(converted * 100) / 10000);
  const conversionSign = converted > 0 ? '+' : '-';
  const convertedFormatted = roundedConverted && `${conversionSign}${roundedConverted}`;

  const onSelectCurrency = () => onSelect(currency);

  return (
    <div className={className} data-testid={`pocket-${currency}`} onClick={onSelectCurrency}>
      {amount}
      <div className={pocketClassName('info')}>
        <div
          className={pocketClassName('converted', { sign: converted > 0 ? 'plus' : 'minus' })}
          data-testid={`pocket-${currency}-converted-value`}
        >
          {convertedFormatted}
        </div>
        <div className={pocketClassName(`rate`)} data-testid={`pocket-${currency}-rate`}>
          {roundedRate || '1.00'}
        </div>
      </div>
    </div>
  );
};

export default memo(Pocket);
