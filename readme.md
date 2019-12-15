# Exchanger

A `storeon` and `react hooks` playground.

## Start

```bash
npm i && npm start
```

## Tests
```bash
npm test
```

## Description

It's a yet another currency exchange app to perform convertation between USD, EUR and GBP with realtime rates from [api.ratesapi.io](https://ratesapi.io/).

### Details

The project uses [`storeon`](https://github.com/ai/storeon) for state management. It's a lightweight (173 bytes) and simplified incarnation of FLUX pattern, which is more performant than `redux` and provides field-wide granularity of reactiveness upon state changes and works with react hooks :fire:. 

The main component, called [`Exchanger`](https://github.com/ujinho/simple-exchanger/blob/master/src/components/Exchanger/Exchanger.tsx), uses react hooks. The most significant part of that approach is using `useStoreon` hook which encapsulates all state-management stuff and provides us with `dispatch` function in order to perform state changes by dispatching actions.

In order to split currency-based logic from project itself and to make work with money values more clear and precise, I used the [`dinero.js`](https://github.com/sarahdayan/dinero.js) library. It seemlessly integrates with currency rates feed and provides Fowler's money pattern interface to store and convert currency values.

As the project is based on react hooks, it uses [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) instead of [`enzyme`](https://airbnb.io/enzyme/) for component's behavioral test. There are a few tests to demostrate conception itself.
