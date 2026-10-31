import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyUpdate, hasUpdate, resetUpdate, subscribeUpdate, watchRegistration } from './swUpdate'

// Un service worker falso: solo lo que usa swUpdate
class FakeWorker extends EventTarget {
  state = 'installing'
  postMessage = vi.fn()
}

class FakeRegistration extends EventTarget {
  installing: FakeWorker | null = null
  waiting: FakeWorker | null = null
}

afterEach(() => {
  resetUpdate()
  vi.unstubAllGlobals()
})

describe('watchRegistration', () => {
  it('no avisa si no se ha publicado nada nuevo', () => {
    watchRegistration(new FakeRegistration() as unknown as ServiceWorkerRegistration, () => true)
    expect(hasUpdate()).toBe(false)
  })

  it('avisa si ya hay una versión nueva esperando', () => {
    const registration = new FakeRegistration()
    registration.waiting = new FakeWorker()
    watchRegistration(registration as unknown as ServiceWorkerRegistration, () => true)
    expect(hasUpdate()).toBe(true)
  })

  it('avisa cuando una versión nueva termina de instalarse', () => {
    const registration = new FakeRegistration()
    watchRegistration(registration as unknown as ServiceWorkerRegistration, () => true)

    const worker = new FakeWorker()
    registration.installing = worker
    registration.dispatchEvent(new Event('updatefound'))
    expect(hasUpdate()).toBe(false)

    worker.state = 'installed'
    registration.waiting = worker
    worker.dispatchEvent(new Event('statechange'))
    expect(hasUpdate()).toBe(true)
  })

  it('no avisa en la primera instalación (aún no controlaba la página)', () => {
    const registration = new FakeRegistration()
    watchRegistration(registration as unknown as ServiceWorkerRegistration, () => false)

    const worker = new FakeWorker()
    registration.installing = worker
    registration.dispatchEvent(new Event('updatefound'))
    worker.state = 'installed'
    worker.dispatchEvent(new Event('statechange'))
    expect(hasUpdate()).toBe(false)
  })

  it('avisa a quien esté suscrito', () => {
    const listener = vi.fn()
    subscribeUpdate(listener)
    const registration = new FakeRegistration()
    registration.waiting = new FakeWorker()
    watchRegistration(registration as unknown as ServiceWorkerRegistration, () => true)
    expect(listener).toHaveBeenCalled()
  })
})

describe('applyUpdate', () => {
  it('activa la versión nueva y recarga cuando toma el control', () => {
    const container = new EventTarget()
    vi.stubGlobal('navigator', { serviceWorker: container })
    const registration = new FakeRegistration()
    const worker = new FakeWorker()
    registration.waiting = worker
    watchRegistration(registration as unknown as ServiceWorkerRegistration, () => true)

    const reload = vi.fn()
    applyUpdate(reload)
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
    expect(reload).not.toHaveBeenCalled()

    container.dispatchEvent(new Event('controllerchange'))
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('no hace nada si no hay versión nueva', () => {
    const reload = vi.fn()
    applyUpdate(reload)
    expect(reload).not.toHaveBeenCalled()
  })
})
