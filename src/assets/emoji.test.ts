import { describe, expect, it } from 'vitest'
import main from '../main.tsx?raw'
import css from './theme.css?raw'

// Lista de fuentes del tema (la de :root)
const fuentes = () => {
  const inicio = css.indexOf(':root {')
  const bloque = css.slice(inicio, css.indexOf('}', inicio))
  const lista = bloque.match(/font-family:\s*([^;]+);/)?.[1] ?? ''
  return lista.split(',').map((fuente) => fuente.trim().replace(/^'|'$/g, ''))
}

describe('emojis con el estilo de Noto (como en Android)', () => {
  it('el tema incluye Noto Color Emoji después de las fuentes de texto, para que solo se use con los emojis', () => {
    const lista = fuentes()
    expect(lista).toContain('Noto Color Emoji')
    for (const texto of ['Trebuchet MS', 'Segoe UI', 'system-ui']) {
      expect(lista.indexOf(texto), texto).toBeGreaterThanOrEqual(0)
      expect(lista.indexOf('Noto Color Emoji'), texto).toBeGreaterThan(lista.indexOf(texto))
    }
  })

  it('la fuente se sirve desde la propia web (paquete local), no desde un servidor externo', () => {
    expect(main).toMatch(/import ['"]@fontsource\/noto-color-emoji/)
    expect(css).not.toMatch(/fonts\.googleapis|fonts\.gstatic/)
  })
})
