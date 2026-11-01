import { describe, expect, it } from 'vitest'
import emojiCss from './assets/emoji-font.css?raw'
import { EMOJIS_CLAROS } from './emojiClaros'
import { emojisDeLaFuente } from './emojiFont'

describe('Emojis claros', () => {
  it('son emojis de un solo carácter que dibuja la fuente de la web, sin repetir', () => {
    const fuente = new Set(emojisDeLaFuente(emojiCss))
    for (const emoji of EMOJIS_CLAROS) {
      expect([...emoji], emoji).toHaveLength(1)
      expect(fuente.has(emoji), emoji).toBe(true)
    }
    expect(new Set(EMOJIS_CLAROS).size).toBe(EMOJIS_CLAROS.length)
  })

  it('incluyen los que casi no se ven sobre blanco: el diente y el salero', () => {
    expect(EMOJIS_CLAROS).toContain('🦷')
    expect(EMOJIS_CLAROS).toContain('🧂')
  })
})
