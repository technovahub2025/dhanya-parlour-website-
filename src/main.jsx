import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/site.css'
import App from './App.jsx'

const resetScrollPosition = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const normalizeHomeUrl = () => {
  if (window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
};

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

resetScrollPosition();
normalizeHomeUrl();
window.addEventListener('load', resetScrollPosition, { once: true });
window.addEventListener('pageshow', resetScrollPosition);
window.addEventListener('load', normalizeHomeUrl, { once: true });
window.addEventListener('pageshow', normalizeHomeUrl);

createRoot(document.getElementById('root')).render(
  <App />
)

requestAnimationFrame(() => {
  resetScrollPosition();
  requestAnimationFrame(resetScrollPosition);
});
