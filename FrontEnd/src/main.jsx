import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import App from './App.jsx'
import './global.scss';
import { AuthProvider } from './features/auth/auth.context.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
