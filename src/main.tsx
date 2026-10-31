import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/emoji-font.css'
import './assets/theme.css'
import App from './App.tsx'
import { UpdateButton } from './components/UpdateButton.tsx'
import { registerServiceWorker } from './swUpdate.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <UpdateButton />
  </StrictMode>,
)

// Permite instalar la app y usarla sin conexión (solo en la versión publicada)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => registerServiceWorker(`${import.meta.env.BASE_URL}sw.js`))
}
