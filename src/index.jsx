import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootContainer = document.getElementById('root');

const normalRoot = createRoot(rootContainer);

normalRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
