import React, { memo } from 'react';
import Pocket from 'components/Pocket';
import { DEFAULT_CURRENCY_FORMAT } from 'const';
import { cn } from '@bem-react/classname';
import { Currency } from 'dinero.js';

type Props = {
  from: Currency;
  to: Currency;
  subtrahend: Dinero.Dinero;
  converted: Dinero.Dinero;
  pockets: ReadonlyArray<Dinero.Dinero>;
  rates: { [key in Currency]?: number };
  onSelectPocket: (symbol: Currency) => void;
};

const exchangerCn = cn('exchanger');

const PocketList = ({ from, to, rates, subtrahend, converted, pockets, onSelectPocket }: Props) => (
  <div className={exchangerCn('pockets')}>
    {pockets.map(pocket => {
      const currency = pocket.getCurrency() as Currency;
      const amountFormatted = pocket.toFormat(DEFAULT_CURRENCY_FORMAT);
      const asSource = currency === from;
      const asDestination = currency === to;
      let convertedAmount: number;

      if (asSource) {
        convertedAmount = subtrahend && subtrahend.multiply(-1).getAmount();
      } else if (asDestination) {
        convertedAmount = converted && converted.getAmount();
      }

      return (
        <Pocket
          key={currency}
          asSource={asSource}
          asDestination={asDestination}
          currency={currency}
          amount={amountFormatted}
          rate={rates && rates[currency]}
          converted={convertedAmount}
          onSelect={onSelectPocket}
        />
      );
    })}
  </div>
);

export default memo(PocketList);
