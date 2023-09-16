import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { init } from './storage';
const container = document.getElementById('root');
const root = createRoot(container!);

init();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);