import { describe, expect, it } from 'vitest'
import main from '../main.tsx?raw'
import emojiFont from './emoji-font.css?raw'
import css from './theme.css?raw'

// Lista de fuentes del tema (la de :root)
const fuentes = () => {
  const inicio = css.indexOf(':root {')
  const bloque = css.slice(inicio, css.indexOf('}', inicio))
  const lista = bloque.match(/font-family:\s*([^;]+);/)?.[1] ?? ''
  return lista.split(',').map((fuente) => fuente.trim().replace(/^'|'$/g, ''))
}

// Ficheros de fuente que hay en el repositorio
const ficheros = Object.keys(import.meta.glob('./fonts/noto-color-emoji/*.woff2', { query: '?url' })).map((ruta) => ruta.split('/').pop())

describe('emojis con el estilo de Noto (como en Android)', () => {
  it('el tema incluye Noto Color Emoji después de las fuentes de texto, para que solo se use con los emojis', () => {
    const lista = fuentes()
    expect(lista).toContain('Noto Color Emoji')
    for (const texto of ['Trebuchet MS', 'Segoe UI', 'system-ui']) {
      expect(lista.indexOf(texto), texto).toBeGreaterThanOrEqual(0)
      expect(lista.indexOf('Noto Color Emoji'), texto).toBeGreaterThan(lista.indexOf(texto))
    }
  })

  it('los botones heredan la fuente de la página; si no, los emojis de los iconos no usarían Noto', () => {
    const inicio = css.indexOf('\nbutton {')
    expect(inicio, 'regla global de button').toBeGreaterThanOrEqual(0)
    expect(css.slice(inicio, css.indexOf('}', inicio))).toMatch(/font-family:\s*inherit/)
  })

  it('la fuente va incluida en la web: main.tsx importa su hoja y no hay servidores externos', () => {
    expect(main).toMatch(/import ['"]\.\/assets\/emoji-font\.css['"]/)
    expect(emojiFont).not.toMatch(/https?:\/\//)
    expect(css).not.toMatch(/fonts\.googleapis|fonts\.gstatic/)
  })

  it('cada @font-face apunta a un fichero que existe y tiene su rango de caracteres', () => {
    const bloques = emojiFont.match(/@font-face\s*\{[^}]*\}/g) ?? []
    expect(bloques.length).toBeGreaterThanOrEqual(11)
    for (const bloque of bloques) {
      expect(bloque).toMatch(/font-family:\s*'Noto Color Emoji'/)
      expect(bloque).toMatch(/unicode-range:/)
      const fichero = bloque.match(/url\(\.\/fonts\/noto-color-emoji\/([^)]+\.woff2)\)/)?.[1]
      expect(fichero, bloque).toBeDefined()
      expect(ficheros, bloque).toContain(fichero)
    }
  })

  it('incluye la licencia de la fuente (OFL)', () => {
    expect(import.meta.glob('./fonts/noto-color-emoji/OFL.txt', { query: '?raw' })).toHaveProperty(['./fonts/noto-color-emoji/OFL.txt'])
  })
})
