import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VoicesScreen } from './VoicesScreen'

const voice = (name: string, lang: string, localService = true) =>
  ({ name, lang, localService, default: false, voiceURI: name }) as SpeechSynthesisVoice

type Fake = {
  voices: SpeechSynthesisVoice[]
  speak: ReturnType<typeof vi.fn>
  cancel: ReturnType<typeof vi.fn>
  listeners: Array<() => void>
}

let fake: Fake

beforeEach(() => {
  fake = { voices: [], speak: vi.fn(), cancel: vi.fn(), listeners: [] }
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      text: string
      lang = ''
      rate = 1
      pitch = 1
      voice: SpeechSynthesisVoice | null = null
      constructor(text: string) {
        this.text = text
      }
    },
  )
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      getVoices: () => fake.voices,
      speak: fake.speak,
      cancel: fake.cancel,
      addEventListener: (_: string, fn: () => void) => fake.listeners.push(fn),
      removeEventListener: (_: string, fn: () => void) => {
        fake.listeners = fake.listeners.filter((l) => l !== fn)
      },
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(window, 'speechSynthesis')
})

const abrir = () => {
  const onHome = vi.fn()
  render(<VoicesScreen onHome={onHome} />)
  return { user: userEvent.setup(), onHome }
}

describe('VoicesScreen: herramienta para probar y elegir la voz', () => {
  it('lista las voces en español del dispositivo, las mejores primero, y oculta las de otros idiomas', () => {
    fake.voices = [
      voice('Zira', 'en-US'),
      voice('Helena', 'es-ES'),
      voice('Alvaro Online (Natural)', 'es-ES', false),
    ]
    abrir()
    const lista = screen.getByRole('list', { name: 'Voces en español' })
    const items = within(lista).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Alvaro Online (Natural)')
    expect(items[0]).toHaveTextContent('es-ES · en línea')
    expect(items[1]).toHaveTextContent('Helena')
    expect(screen.queryByText('Zira')).not.toBeInTheDocument()
  })

  it('si no hay voces en español lo dice', () => {
    fake.voices = [voice('Zira', 'en-US')]
    abrir()
    expect(screen.getByText(/No hay voces en español/)).toBeInTheDocument()
  })

  it('las voces que se cargan más tarde aparecen solas', () => {
    abrir()
    expect(screen.getByText(/No hay voces en español/)).toBeInTheDocument()
    fake.voices = [voice('Helena', 'es-ES')]
    act(() => fake.listeners.forEach((l) => l()))
    expect(screen.getByRole('button', { name: 'Escuchar con Helena' })).toBeInTheDocument()
  })

  it('cada voz lee el texto escrito con su velocidad y su tono', async () => {
    fake.voices = [voice('Helena', 'es-ES')]
    const { user } = abrir()
    const texto = screen.getByRole('textbox', { name: 'Texto' })
    await user.clear(texto)
    await user.type(texto, 'Hola Repi')
    await user.click(screen.getByRole('button', { name: 'Escuchar con Helena' }))
    const utterance = fake.speak.mock.calls[0][0]
    expect(utterance.text).toBe('Hola Repi')
    expect(utterance.voice.name).toBe('Helena')
    expect(utterance.rate).toBe(0.9)
    expect(utterance.pitch).toBe(1)
  })

  it('los controles de velocidad y tono cambian lo que se oye', async () => {
    fake.voices = [voice('Helena', 'es-ES')]
    const { user } = abrir()
    fireEvent.change(screen.getByRole('slider', { name: /Velocidad/ }), { target: { value: '0.7' } })
    fireEvent.change(screen.getByRole('slider', { name: /Tono/ }), { target: { value: '1.4' } })
    await user.click(screen.getByRole('button', { name: 'Escuchar con Helena' }))
    const utterance = fake.speak.mock.calls[0][0]
    expect(utterance.rate).toBe(0.7)
    expect(utterance.pitch).toBe(1.4)
  })

  it('las frases de ejemplo rellenan el texto', async () => {
    fake.voices = [voice('Helena', 'es-ES')]
    const { user } = abrir()
    await user.click(screen.getByRole('button', { name: 'Números' }))
    expect(screen.getByRole('textbox', { name: 'Texto' })).not.toHaveValue('')
    const antes = (screen.getByRole('textbox', { name: 'Texto' }) as HTMLTextAreaElement).value
    await user.click(screen.getByRole('button', { name: 'Primaria' }))
    expect((screen.getByRole('textbox', { name: 'Texto' }) as HTMLTextAreaElement).value).not.toBe(antes)
  })

  it('vuelve al inicio con el botón de la barra', async () => {
    const { user, onHome } = abrir()
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(onHome).toHaveBeenCalled()
  })
})
