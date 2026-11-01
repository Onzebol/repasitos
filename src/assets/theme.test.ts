import { describe, expect, it } from 'vitest'
import css from './theme.css?raw'

// Recorre theme.css sin comentarios y devuelve los problemas de llaves que encuentre. Una llave sin cerrar hace que
// el navegador descarte en silencio todas las reglas que vienen después (pasó con `.voices-name`, #77).
function problemasDeLlaves(texto: string): string[] {
  const sinComentarios = texto.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  const problemas: string[] = []
  const pila: { cabecera: string; linea: number }[] = []
  let linea = 1
  let inicio = 0
  for (let i = 0; i < sinComentarios.length; i++) {
    const c = sinComentarios[i]
    if (c === '\n') linea++
    if (c === '{') {
      const cabecera = sinComentarios.slice(inicio, i).trim()
      const padre = pila[pila.length - 1]
      // dentro de una regla normal no puede abrirse otra (solo dentro de @media, @supports, @layer…)
      if (padre && !padre.cabecera.startsWith('@')) {
        problemas.push(`línea ${linea}: «${cabecera}» está dentro de «${padre.cabecera}» (línea ${padre.linea}), que no se cerró`)
      }
      pila.push({ cabecera, linea })
      inicio = i + 1
    } else if (c === '}') {
      if (pila.length === 0) problemas.push(`línea ${linea}: sobra una llave de cierre`)
      pila.pop()
      inicio = i + 1
    } else if (c === ';') {
      inicio = i + 1
    }
  }
  for (const abierta of pila) problemas.push(`línea ${abierta.linea}: «${abierta.cabecera}» no se cierra`)
  return problemas
}

describe('theme.css', () => {
  it('tiene todas las llaves cerradas y ninguna regla dentro de otra', () => {
    expect(problemasDeLlaves(css)).toEqual([])
  })

  it('el detector encuentra una llave sin cerrar', () => {
    const roto = '.a {\n  color: red;\n\n.b {\n  color: blue;\n}\n'
    expect(problemasDeLlaves(roto).length).toBeGreaterThan(0)
  })

  it('el detector acepta reglas dentro de @media', () => {
    expect(problemasDeLlaves('@media (min-width: 1px) {\n  .a {\n    color: red;\n  }\n}\n')).toEqual([])
  })
})
