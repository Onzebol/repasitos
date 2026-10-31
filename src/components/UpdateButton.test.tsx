import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetUpdate, watchRegistration } from '../swUpdate'
import { UpdateButton } from './UpdateButton'

afterEach(() => {
  resetUpdate()
  vi.unstubAllGlobals()
})

const publishUpdate = () => {
  const worker = Object.assign(new EventTarget(), { state: 'installed', postMessage: vi.fn() })
  const registration = Object.assign(new EventTarget(), { installing: null, waiting: worker })
  watchRegistration(registration as unknown as ServiceWorkerRegistration, () => true)
  return worker
}

describe('UpdateButton', () => {
  it('no se ve si no hay versión nueva', () => {
    render(<UpdateButton />)
    expect(screen.queryByRole('button', { name: /actualizar/i })).not.toBeInTheDocument()
  })

  it('aparece cuando llega una versión nueva y la activa al pulsarlo', async () => {
    vi.stubGlobal('navigator', { serviceWorker: new EventTarget() })
    render(<UpdateButton />)
    let worker!: ReturnType<typeof publishUpdate>
    act(() => {
      worker = publishUpdate()
    })

    await userEvent.click(screen.getByRole('button', { name: /actualizar/i }))
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
  })
})
