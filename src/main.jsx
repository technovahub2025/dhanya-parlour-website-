import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/site.css'
import App from './App.jsx'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

createRoot(document.getElementById('root')).render(
  <App />
)
