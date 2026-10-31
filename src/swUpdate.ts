// Aviso de versión nueva de la app instalada (PWA).
// Cuando el service worker nuevo termina de instalarse y queda esperando, se guarda aquí;
// la interfaz lo lee con `hasUpdate` y, al pulsar «Actualizar», `applyUpdate` lo activa y recarga.

let waiting: ServiceWorker | null = null
const listeners = new Set<() => void>()

const notify = () => listeners.forEach((listener) => listener())

const setWaiting = (worker: ServiceWorker | null) => {
  waiting = worker
  notify()
}

export const subscribeUpdate = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const hasUpdate = () => waiting !== null

// Solo para los tests
export const resetUpdate = () => {
  waiting = null
  listeners.clear()
}

const hasController = () => Boolean(navigator.serviceWorker.controller)

// Vigila el registro: avisa si ya hay una versión esperando o si llega una durante la sesión.
// Si la página aún no tenía service worker (primera visita), no es una actualización.
export function watchRegistration(
  registration: ServiceWorkerRegistration,
  isUpdate: () => boolean = hasController,
) {
  if (registration.waiting && isUpdate()) setWaiting(registration.waiting)

  registration.addEventListener('updatefound', () => {
    const worker = registration.installing
    if (!worker) return
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && isUpdate()) setWaiting(registration.waiting ?? worker)
    })
  })
}

// Activa la versión nueva y recarga la página cuando toma el control
export function applyUpdate(reload: () => void = () => window.location.reload()) {
  if (!waiting) return
  navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true })
  waiting.postMessage({ type: 'SKIP_WAITING' })
}

// Registra el service worker y vigila las versiones nuevas (también al volver a la app)
export function registerServiceWorker(url: string) {
  navigator.serviceWorker.register(url).then((registration) => {
    watchRegistration(registration)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') registration.update().catch(() => {})
    })
  })
}
