import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import './index.css';
import App from './App';
import { persistor, store } from './store';
import { initializeI18next } from './utils/i18next';

const {
  preference: {
    locale: { code },
  },
} = store.getState();

(async () => {
  const i18n = await initializeI18next(code);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <PersistGate loading={<></>} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </I18nextProvider>
    </StrictMode>,
  );
})();
