import { describe, expect, it } from 'vitest'
import { describeVoice, quality, spanishVoices } from './voices'

const voice = (name: string, lang: string, localService = true) =>
  ({ name, lang, localService, default: false, voiceURI: name }) as SpeechSynthesisVoice

describe('quality: cómo de natural suena una voz según su nombre', () => {
  it('reconoce las voces neuronales de Edge («Natural», «Online») y las «Neural»', () => {
    expect(quality(voice('Microsoft Alvaro Online (Natural) - Spanish (Spain)', 'es-ES', false))).toBe('natural')
    expect(quality(voice('Azure Neural Elvira', 'es-ES'))).toBe('natural')
  })

  it('reconoce las voces de Google', () => {
    expect(quality(voice('Google español', 'es-ES', false))).toBe('google')
  })

  it('el resto son voces normales del sistema', () => {
    expect(quality(voice('Microsoft Helena - Spanish (Spain)', 'es-ES'))).toBe('normal')
  })
})

describe('spanishVoices: voces en español, de mejor a peor', () => {
  it('descarta las voces de otros idiomas', () => {
    const result = spanishVoices([voice('Zira', 'en-US'), voice('Helena', 'es-ES'), voice('Amelie', 'fr-FR')])
    expect(result.map((v) => v.name)).toEqual(['Helena'])
  })

  it('acepta todas las variantes del español (es-ES, es-MX, es_AR…)', () => {
    const result = spanishVoices([voice('A', 'es-MX'), voice('B', 'es_AR'), voice('C', 'es')])
    expect(result).toHaveLength(3)
  })

  it('pone primero las naturales, luego las de Google y al final las normales', () => {
    const result = spanishVoices([
      voice('Helena', 'es-ES'),
      voice('Google español', 'es-ES', false),
      voice('Alvaro Online (Natural)', 'es-ES', false),
    ])
    expect(result.map((v) => v.name)).toEqual(['Alvaro Online (Natural)', 'Google español', 'Helena'])
  })

  it('a igual calidad, primero es-ES y después las demás variantes', () => {
    const result = spanishVoices([voice('Paulina', 'es-MX'), voice('Helena', 'es-ES')])
    expect(result.map((v) => v.name)).toEqual(['Helena', 'Paulina'])
  })

  it('no modifica la lista original', () => {
    const original = [voice('B', 'es-MX'), voice('A', 'es-ES')]
    spanishVoices(original)
    expect(original.map((v) => v.name)).toEqual(['B', 'A'])
  })
})

describe('describeVoice', () => {
  it('indica el idioma y si funciona sin conexión o envía el texto a un servidor', () => {
    expect(describeVoice(voice('Helena', 'es-ES', true))).toBe('es-ES · en el dispositivo')
    expect(describeVoice(voice('Google español', 'es-ES', false))).toBe('es-ES · en línea')
  })
})
