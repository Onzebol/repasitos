import { describe, expect, it } from 'vitest'
import css from './assets/emoji-font.css?raw'
import { categoriaDe, emojisDeLaFuente, parseUnicodeRange } from './emojiFont'

describe('parseUnicodeRange', () => {
  it('lee valores sueltos y rangos en hexadecimal', () => {
    expect(parseUnicodeRange('U+30-32,U+a9')).toEqual([0x30, 0x31, 0x32, 0xa9])
  })

  it('acepta mayúsculas y espacios tras las comas', () => {
    expect(parseUnicodeRange('U+1F436, U+1F431')).toEqual([0x1f436, 0x1f431])
  })
})

describe('emojisDeLaFuente: los iconos que la web sabe dibujar', () => {
  const emojis = emojisDeLaFuente(css)

  it('incluye animales, caras y las flechas que antes salían como emoji', () => {
    for (const emoji of ['🐶', '🦊', '😀', '🚌', '◀', '▶']) {
      expect(emojis).toContain(emoji)
    }
  })

  it('deja fuera cifras, almohadilla, uniones y selectores que no son iconos', () => {
    for (const texto of ['0', '9', '#', '*', '‍', '️', '\u{1f1e6}']) {
      expect(emojis).not.toContain(texto)
    }
  })

  it('no repite ninguno y van en orden', () => {
    expect(new Set(emojis).size).toBe(emojis.length)
    const puntos = emojis.map((emoji) => emoji.codePointAt(0)!)
    expect(puntos).toEqual([...puntos].sort((a, b) => a - b))
  })

  it('son cientos: la fuente completa, no una lista a mano', () => {
    expect(emojis.length).toBeGreaterThan(800)
  })
})

describe('categoriaDe', () => {
  it('agrupa por bloque de Unicode', () => {
    expect(categoriaDe('🐶')).toBe('Animales')
    expect(categoriaDe('😀')).toBe('Caras y gestos')
    expect(categoriaDe('🚌')).toBe('Transporte y mapas')
  })

  it('lo que no está en ningún bloque conocido va a "Otros símbolos"', () => {
    expect(categoriaDe('◀')).toBe('Otros símbolos')
  })
})
