import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // or Tailwind's entry file

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


