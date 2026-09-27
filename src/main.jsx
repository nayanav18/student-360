/* ============================================================
   main.jsx — Application entry point
   
   This is the FIRST file React loads. It renders <App /> into
   the #root div in index.html.
   
   We wrap the entire app in:
   - BrowserRouter: enables React Router (URL-based navigation)
   - AppProvider: enables our global context (theme, tasks, etc.)
   ============================================================ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
