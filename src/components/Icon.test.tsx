import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { iconosInterfaz } from '../icons'
import { Icon } from './Icon'

// Los textos de los componentes (sin pruebas ni comentarios) para vigilar que no vuelvan los símbolos sueltos
const fuentes = import.meta.glob(['../*.tsx', './*.tsx', '!**/*.test.tsx'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

describe('Icon', () => {
  it('un icono de texto se pinta oculto para los lectores de pantalla', () => {
    const { container } = render(<Icon name="home" />)
    const span = container.querySelector('span')
    expect(span).toHaveAttribute('aria-hidden', 'true')
    expect(span).toHaveTextContent(iconosInterfaz.home.glyph!)
  })

  it('las flechas son un dibujo SVG, no un carácter', () => {
    const { container } = render(
      <>
        <Icon name="back" />
        <Icon name="next" />
      </>,
    )
    expect(container.querySelectorAll('svg')).toHaveLength(2)
    expect(container).not.toHaveTextContent(/[◀▶]/)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})

describe('símbolos en los componentes', () => {
  it('ningún componente escribe un icono a mano: todos salen de src/icons.ts', () => {
    const simbolo = /[\p{Extended_Pictographic}◀▶↻⌫✔]/u
    const culpables = Object.entries(fuentes)
      .filter(([ruta]) => !ruta.endsWith('/icons.ts'))
      .filter(([, texto]) =>
        texto
          .split('\n')
          .filter((linea) => !linea.trim().startsWith('//'))
          .some((linea) => simbolo.test(linea)),
      )
      .map(([ruta]) => ruta)
    expect(culpables).toEqual([])
  })
})
