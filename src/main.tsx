import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/noto-color-emoji'
import './assets/theme.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Permite instalar la app y usarla sin conexión (solo en la versión publicada)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
  })
}
