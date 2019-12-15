/// <reference types="webpack-env" />
import * as React from 'react';
import * as ReactDOM from '@hot-loader/react-dom';

import StoreContext from 'storeon/react/context';

import Dinero from 'dinero.js';

// @ts-ignore
Dinero.globalLocale = 'ru-RU';

import App from 'components/App';

import store from './store';

const reactMountPoint = document && document.getElementById('content');

const mount = (element: React.ReactElement<any>) => {
  if (reactMountPoint) {
    ReactDOM.render(element, reactMountPoint);
  }
};

if (module.hot) {
  module.hot.accept();
}

mount(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
);
