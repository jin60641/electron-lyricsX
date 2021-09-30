import React from 'react';

import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { persistor, store } from './store';
import { initializeI18next } from './utils/i18next';

const { locale: { code } } = store.getState();

(async () => {
  const i18n = await initializeI18next(code);

  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={<></>} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </I18nextProvider>,
    document.getElementById('root'),
  );
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
