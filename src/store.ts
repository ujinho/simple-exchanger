import createStore from 'storeon';

import rates, { RatesState, RatesEvents } from './reducers/rates';
import pockets, { PocketsState, PocketsEvents } from './reducers/pockets';

export interface AppState extends RatesState, PocketsState {}

export type Events = PocketsEvents | RatesEvents;

export default createStore<AppState, Events>([rates, pockets]);
