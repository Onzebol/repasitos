import { describe, expect, it } from 'vitest'
import { titleFits } from './titleFits'

describe('titleFits: ¿cabe el título en el centro, entre los botones?', () => {
  it('cabe si queda sitio tras reservar a cada lado el botón más ancho y el hueco', () => {
    // 1000 de barra - 2 × (150 de botones + 16 de hueco) = 668 libres
    expect(titleFits({ textWidth: 668, barWidth: 1000, sideWidth: 150, gap: 16 })).toBe(true)
    expect(titleFits({ textWidth: 669, barWidth: 1000, sideWidth: 150, gap: 16 })).toBe(false)
  })

  it('un título vacío o aún sin medir no se apila', () => {
    expect(titleFits({ textWidth: 0, barWidth: 0, sideWidth: 0, gap: 0 })).toBe(true)
  })
})
