import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ModusWcThemeProvider } from '@trimble-oss/moduswebcomponents-react';
import '@trimble-oss/moduswebcomponents/modus-wc-styles.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModusWcThemeProvider initialTheme={{ theme: 'modus-classic' }}>
      <App />
    </ModusWcThemeProvider>
  </StrictMode>,
);
