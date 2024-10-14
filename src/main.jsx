import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import axios from 'axios';

import store from '@/store';
import { Provider } from 'react-redux';

import './assets/scss/styles.scss';

import App from '@/App';

/**
 * 預設 axios 的 API 請求路徑
 */
axios.defaults.baseURL = import.meta.env.VITE_API;

const root = createRoot(document.getElementById('root'));
root.render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </StrictMode>,
);
