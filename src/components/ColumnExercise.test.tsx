import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { topicFrom } from '../test/topics'
import type { Exercise } from '../types'
import { Practice } from './Practice'

const suma: Exercise = { type: 'column', question: 'Suma en columna', operator: '+', top: 23, bottom: 14, answer: 37 }
const resta: Exercise = { type: 'column', question: 'Resta en columna', operator: '−', top: 68, bottom: 63, answer: 5 }

const abrir = (...exercises: Exercise[]) => {
  render(<Practice topic={topicFrom(exercises, 'Columna')} onHome={vi.fn()} onBack={vi.fn()} />)
  return userEvent.setup()
}

const tecla = (user: ReturnType<typeof userEvent.setup>, cifras: string) =>
  cifras.split('').reduce((p, c) => p.then(() => user.click(screen.getByRole('button', { name: c }))), Promise.resolve())

const unidades = () => screen.getByRole('button', { name: /Unidades/ })
const decenas = () => screen.getByRole('button', { name: /Decenas/ })

describe('Ejercicio en columna: aspecto', () => {
  it('pone un número encima del otro, con el signo y las columnas D y U', () => {
    abrir(suma)
    const columna = screen.getByRole('group', { name: '23 + 14' })
    expect(within(columna).getByText('D')).toBeInTheDocument()
    expect(within(columna).getByText('U')).toBeInTheDocument()
    expect(within(columna).getByText('+')).toBeInTheDocument()
    for (const cifra of ['2', '3', '1', '4']) {
      expect(within(columna).getAllByText(cifra).length).toBeGreaterThan(0)
    }
    expect(decenas()).toBeInTheDocument()
    expect(unidades()).toBeInTheDocument()
  })

  it('las restas usan el signo −', () => {
    abrir(resta)
    expect(within(screen.getByRole('group', { name: '68 − 63' })).getByText('−')).toBeInTheDocument()
  })
})

describe('Ejercicio en columna: escribir el resultado', () => {
  it('se empieza por las unidades y el teclado pasa solo a las decenas', async () => {
    const user = abrir(suma)
    expect(unidades()).toHaveAttribute('aria-pressed', 'true')
    await tecla(user, '7')
    expect(unidades()).toHaveTextContent('7')
    expect(decenas()).toHaveAttribute('aria-pressed', 'true')
    await tecla(user, '3')
    expect(decenas()).toHaveTextContent('3')
  })

  it('se puede tocar un cuadro para corregirlo', async () => {
    const user = abrir(suma)
    await tecla(user, '75')
    await user.click(unidades())
    await tecla(user, '7')
    expect(unidades()).toHaveTextContent('7')
    expect(decenas()).toHaveTextContent('5')
  })

  it('Borrar vacía el cuadro activo', async () => {
    const user = abrir(suma)
    await tecla(user, '7')
    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(decenas()).toHaveTextContent('?')
    expect(unidades()).toHaveTextContent('7')
    await user.click(unidades())
    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(unidades()).toHaveTextContent('?')
  })

  it('Comprobar está desactivado hasta rellenar los dos cuadros', async () => {
    const user = abrir(suma)
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled()
    await tecla(user, '7')
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled()
    await tecla(user, '3')
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeEnabled()
  })
})

describe('Ejercicio en columna: comprobar', () => {
  it('23 + 14 solo es correcto con 3 decenas y 7 unidades', async () => {
    const user = abrir(suma)
    await tecla(user, '73')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('con una cifra mal en cualquiera de los cuadros anima y deja reintentar', async () => {
    const user = abrir(suma)
    await tecla(user, '63') // unidades mal
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(unidades()).toHaveTextContent('?')
    expect(decenas()).toHaveTextContent('?')
    expect(unidades()).toHaveAttribute('aria-pressed', 'true')

    await tecla(user, '74') // decenas mal
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()

    await tecla(user, '73')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('un resultado de una cifra se admite con 0 en las decenas', async () => {
    const user = abrir(resta)
    await tecla(user, '50')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('el siguiente ejercicio empieza con los cuadros vacíos', async () => {
    const user = abrir(suma, resta)
    await tecla(user, '73')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    await user.click(screen.getByRole('button', { name: /Siguiente/ }))
    expect(unidades()).toHaveTextContent('?')
    expect(decenas()).toHaveTextContent('?')
  })
})

describe('Ejercicio en columna: sumas llevando', () => {
  const llevando: Exercise = { type: 'column', question: 'Suma en columna', operator: '+', top: 28, bottom: 17, answer: 45, carry: true }
  const conCentenas: Exercise = { type: 'column', question: 'Suma en columna', operator: '+', top: 85, bottom: 47, answer: 132, carry: true }
  const llevada = () => screen.getByRole('button', { name: /Llevada/ })
  const centenas = () => screen.getByRole('button', { name: /Centenas/ })
  const comprobar = () => screen.getByRole('button', { name: 'Comprobar' })

  it('muestra el cuadro de llevada solo en las sumas llevando', () => {
    abrir(llevando)
    expect(llevada()).toBeInTheDocument()
  })

  it('las columnas sin llevar no tienen cuadro de llevada', () => {
    abrir(suma)
    expect(screen.queryByRole('button', { name: /Llevada/ })).not.toBeInTheDocument()
  })

  it('la llevada es opcional: el resultado se comprueba sin escribirla', async () => {
    const user = abrir(llevando)
    await tecla(user, '54')
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('se puede escribir la llevada, vuelve a las decenas y no cuenta como respuesta', async () => {
    const user = abrir(llevando)
    await tecla(user, '5')
    await user.click(llevada())
    await tecla(user, '1')
    expect(llevada()).toHaveTextContent('1')
    expect(decenas()).toHaveAttribute('aria-pressed', 'true')
    await tecla(user, '4')
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('una llevada equivocada no impide acertar y al fallar se vacía todo', async () => {
    const user = abrir(llevando)
    await tecla(user, '6')
    await user.click(llevada())
    await tecla(user, '1')
    await tecla(user, '4')
    await user.click(comprobar())
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(llevada()).toHaveTextContent('?')
    expect(unidades()).toHaveTextContent('?')
  })

  it('con un resultado de 100 o más aparece el cuadro de centenas y hay que rellenar los tres', async () => {
    const user = abrir(conCentenas)
    expect(centenas()).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    await tecla(user, '23')
    expect(comprobar()).toBeDisabled()
    await tecla(user, '1')
    expect(comprobar()).toBeEnabled()
    expect(centenas()).toHaveTextContent('1')
    await user.click(comprobar())
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })

  it('con un resultado menor de 100 no hay cuadro de centenas', () => {
    abrir(llevando)
    expect(screen.queryByRole('button', { name: /Centenas/ })).not.toBeInTheDocument()
    expect(screen.queryByText('C')).not.toBeInTheDocument()
  })

  it('un resultado de tres cifras con una cifra mal anima y deja reintentar', async () => {
    const user = abrir(conCentenas)
    await tecla(user, '241')
    await user.click(comprobar())
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(unidades()).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Ejercicio en columna: estilos', () => {
  it('las cifras se alinean en una cuadrícula de 3 columnas y el cuadro activo se resalta', async () => {
    const { default: css } = await import('../assets/theme.css?raw')
    const regla = (selector: string) => {
      const inicio = css.indexOf(`\n${selector} {`)
      return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
    }
    expect(regla('.column')).toMatch(/grid-template-columns:\s*2rem repeat\(var\(--places\), 3\.5rem\)/)
    expect(regla('.column-line')).toMatch(/grid-column:\s*1\s*\/\s*-1/)
    expect(regla('.column-box.active')).toMatch(/border-color|background/)
  })
})
