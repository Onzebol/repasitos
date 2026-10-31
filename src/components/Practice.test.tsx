import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import css from '../assets/theme.css?raw'
import { mulberry32 } from '../random'
import { speak } from '../speak'
import { topicFrom } from '../test/topics'
import type { Topic } from '../types'
import { Practice } from './Practice'

vi.mock('../speak', () => ({ speak: vi.fn() }))

const tema = topicFrom([
  { type: 'choice', question: '¿Qué número va después del 39?', options: ['38', '40', '49'], answer: '40' },
  { type: 'number', question: '23 + 14 =', answer: 37 },
])

// Tema que genera ejercicios distintos cada vez: 10 sumas en columna
const temaGenerado: Topic = {
  id: 'generado',
  name: 'Tema generado',
  icon: '🧪',
  tint: '#fff',
  plan: [{ spec: { kind: 'column', operator: '+' }, count: 10 }],
}

const renderPractice = () => {
  const onHome = vi.fn()
  const onBack = vi.fn()
  render(<Practice topic={tema} onHome={onHome} onBack={onBack} />)
  return { user: userEvent.setup(), onHome, onBack }
}

describe('Practice: ejercicios de elegir', () => {
  it('muestra la pregunta y las opciones', () => {
    renderPractice()
    expect(screen.getByRole('heading', { name: '¿Qué número va después del 39?' })).toBeInTheDocument()
    for (const option of ['38', '40', '49']) {
      expect(screen.getByRole('button', { name: option })).toBeEnabled()
    }
  })

  it('ante un fallo anima, desactiva esa opción y deja volver a intentarlo', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '38' }))
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '38' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '40' })).toBeEnabled()
    expect(screen.queryByText('¡Muy bien!')).not.toBeInTheDocument()
  })

  it('las opciones con dibujos usan su etiqueta como nombre accesible y tienen su propio estilo', () => {
    const grupos = topicFrom([
      {
        type: 'choice',
        question: '¿Dónde hay 2?',
        visual: '2',
        options: ['🐶🐶', '🐶🐶🐶'],
        answer: '🐶🐶',
        labels: { '🐶🐶': '2 perros', '🐶🐶🐶': '3 perros' },
      },
    ])
    render(<Practice topic={grupos} profile="infantil" onHome={vi.fn()} onBack={vi.fn()} />)
    for (const nombre of ['2 perros', '3 perros']) {
      expect(screen.getByRole('button', { name: nombre })).toHaveClass('option', 'option-group')
    }
  })

  it('las opciones normales no llevan el estilo de grupo', () => {
    renderPractice()
    expect(screen.getByRole('button', { name: '40' })).not.toHaveClass('option-group')
  })

  describe('contar tocando', () => {
    const contar = topicFrom([
      { type: 'choice', question: '¿Cuántos perros hay?', visual: '🐶🐶🐶', options: ['3', '2', '4'], answer: '3', tapToCount: true },
    ])
    const abrirContar = () => {
      render(<Practice topic={contar} profile="infantil" onHome={vi.fn()} onBack={vi.fn()} />)
      return userEvent.setup()
    }

    it('al principio solo están los dibujos para contar: las cifras aparecen al contarlos todos', async () => {
      const user = abrirContar()
      expect(screen.getAllByRole('button', { name: 'Contar' })).toHaveLength(3)
      for (const cifra of ['3', '2', '4']) expect(screen.queryByRole('button', { name: cifra })).not.toBeInTheDocument()
      await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
      await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
      expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument()
      await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
      for (const cifra of ['3', '2', '4']) expect(screen.getByRole('button', { name: cifra })).toBeEnabled()
      expect(screen.getByRole('button', { name: 'Contado 3' })).toBeInTheDocument()
    })

    it('el dibujo no se repite escrito: solo está el que se cuenta', () => {
      abrirContar()
      expect(document.querySelectorAll('.visual')).toHaveLength(0)
    })

    it('tras contar, elegir la cifra correcta felicita y la equivocada anima a intentarlo otra vez', async () => {
      const user = abrirContar()
      for (let i = 0; i < 3; i++) await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
      await user.click(screen.getByRole('button', { name: '2' }))
      expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: '3' }))
      expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    })

    it('al pasar al siguiente ejercicio hay que volver a contar', async () => {
      const dos = topicFrom([
        { type: 'choice', question: '¿Cuántos gatos hay?', visual: '🐱🐱', options: ['2', '1', '3'], answer: '2', tapToCount: true },
        { type: 'choice', question: '¿Cuántos osos hay?', visual: '🐻🐻🐻', options: ['3', '2', '1'], answer: '3', tapToCount: true },
      ])
      render(<Practice topic={dos} profile="infantil" onHome={vi.fn()} onBack={vi.fn()} />)
      const user = userEvent.setup()
      for (let i = 0; i < 2; i++) await user.click(screen.getAllByRole('button', { name: 'Contar' })[0])
      await user.click(screen.getByRole('button', { name: '2' }))
      await user.click(screen.getByRole('button', { name: /Siguiente/ }))
      expect(screen.getAllByRole('button', { name: 'Contar' })).toHaveLength(3)
      expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument()
    })
  })

  it('un ejercicio de trazo ofrece repasar la cifra y, al hacerlo, felicita y ofrece Siguiente', async () => {
    const onBack = vi.fn()
    render(
      <Practice
        topic={topicFrom([{ type: 'trace', question: 'Repasa el número 4', digit: 4, answer: 4 }])}
        onHome={vi.fn()}
        onBack={onBack}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Repasa el número 4' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Repasa el número 4 con el dedo' })).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ya lo he hecho' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Terminar/ })).toBeInTheDocument()
  })

  it('Siguiente lleva su flecha en SVG, no como carácter', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '40' }))
    const siguiente = screen.getByRole('button', { name: /Siguiente/ })
    expect(siguiente.querySelector('svg')).not.toBeNull()
    expect(siguiente).not.toHaveTextContent('▶')
  })

  it('con la respuesta correcta felicita y ofrece Siguiente', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '40' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Siguiente/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '38' })).not.toBeInTheDocument()
  })

  it('no hay límite de intentos: se puede fallar varias veces y luego acertar', async () => {
    const { user } = renderPractice()
    await user.click(screen.getByRole('button', { name: '38' }))
    await user.click(screen.getByRole('button', { name: '49' }))
    await user.click(screen.getByRole('button', { name: '40' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })
})

describe('Practice: ejercicios de escribir un número', () => {
  const irAlEjercicioNumerico = async () => {
    const contexto = renderPractice()
    await contexto.user.click(screen.getByRole('button', { name: '40' }))
    await contexto.user.click(screen.getByRole('button', { name: /Siguiente/ }))
    return contexto
  }

  const escribir = async (user: ReturnType<typeof userEvent.setup>, cifras: string) => {
    for (const cifra of cifras) await user.click(screen.getByRole('button', { name: cifra }))
  }

  it('muestra el teclado y la comprobación está desactivada hasta escribir algo', async () => {
    await irAlEjercicioNumerico()
    expect(screen.getByRole('heading', { name: '23 + 14 =' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comprobar' })).toBeDisabled()
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('?')
  })

  it('escribe las cifras en el cuadro y permite borrar', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '37')
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('37')
    await user.click(screen.getByRole('button', { name: 'Borrar' }))
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('3')
  })

  it('admite como máximo tres cifras', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '12345')
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('123')
  })

  it('ante un número incorrecto anima y vacía el cuadro para reintentar', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '36')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Casi! Inténtalo otra vez')).toBeInTheDocument()
    expect(screen.getByLabelText('Tu respuesta')).toHaveTextContent('?')
  })

  it('con el número correcto felicita y muestra la respuesta', async () => {
    const { user } = await irAlEjercicioNumerico()
    await escribir(user, '37')
    await user.click(screen.getByRole('button', { name: 'Comprobar' }))
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Terminar/ })).toBeInTheDocument()
  })
})

describe('Practice: final del tema y navegación', () => {
  const terminarTema = async () => {
    const contexto = renderPractice()
    await contexto.user.click(screen.getByRole('button', { name: '40' }))
    await contexto.user.click(screen.getByRole('button', { name: /Siguiente/ }))
    for (const cifra of '37') await contexto.user.click(screen.getByRole('button', { name: cifra }))
    await contexto.user.click(screen.getByRole('button', { name: 'Comprobar' }))
    await contexto.user.click(screen.getByRole('button', { name: /Terminar/ }))
    return contexto
  }

  it('al terminar muestra el cierre con Repetir y Elegir otro tema', async () => {
    await terminarTema()
    expect(screen.getByText('¡Muy bien! Has terminado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Repetir/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Elegir otro tema/ })).toBeInTheDocument()
  })

  it('Repetir vuelve al primer ejercicio', async () => {
    const { user } = await terminarTema()
    await user.click(screen.getByRole('button', { name: /Repetir/ }))
    expect(screen.getByRole('heading', { name: '¿Qué número va después del 39?' })).toBeInTheDocument()
  })

  it('Elegir otro tema y los botones de la barra llaman a la navegación', async () => {
    const { user, onBack, onHome } = await terminarTema()
    await user.click(screen.getByRole('button', { name: /Elegir otro tema/ }))
    expect(onBack).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(onHome).toHaveBeenCalledTimes(1)
  })
})

describe('Practice: sesiones aleatorias', () => {
  const operaciones = () => screen.getByRole('group', { name: /^\d+ \+ \d+$/ }).getAttribute('aria-label')

  const resolverSesion = async (user: ReturnType<typeof userEvent.setup>) => {
    const hechas: string[] = []
    for (let i = 0; i < 10; i++) {
      const [a, b] = operaciones()!.match(/\d+/g)!.map(Number)
      hechas.push(`${a}+${b}`)
      const resultado = String(a + b).padStart(2, '0')
      await user.click(screen.getByRole('button', { name: resultado[1] }))
      await user.click(screen.getByRole('button', { name: resultado[0] }))
      await user.click(screen.getByRole('button', { name: 'Comprobar' }))
      await user.click(screen.getByRole('button', { name: /Siguiente|Terminar/ }))
    }
    return hechas
  }

  it('la sesión tiene 10 ejercicios y no cambia mientras se contesta', async () => {
    render(<Practice topic={temaGenerado} onHome={vi.fn()} onBack={vi.fn()} rng={mulberry32(7)} />)
    const user = userEvent.setup()
    expect(screen.getByLabelText('Ejercicio 1 de 10')).toBeInTheDocument()
    const primera = operaciones()
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'Unidades' }))
    expect(operaciones()).toBe(primera)
  })

  it('Repetir empieza otra sesión con ejercicios distintos', async () => {
    render(<Practice topic={temaGenerado} onHome={vi.fn()} onBack={vi.fn()} rng={mulberry32(7)} />)
    const user = userEvent.setup()
    const primera = await resolverSesion(user)
    expect(new Set(primera).size).toBe(10)
    await user.click(screen.getByRole('button', { name: /Repetir/ }))
    const segunda = await resolverSesion(user)
    expect(new Set(segunda).size).toBe(10)
    expect(segunda.filter((operacion) => primera.includes(operacion))).toEqual([])
  }, 30000)
})

describe('Practice: piezas de decenas y unidades', () => {
  const regla = (selector: string) => {
    const inicio = css.indexOf(`\n${selector} {`)
    return inicio < 0 ? '' : css.slice(inicio, css.indexOf('}', inicio))
  }

  it('las decenas y las unidades son dos bloques separados para poder pasar a otra línea', () => {
    const topic = topicFrom([{ type: 'number', question: '¿Qué número es?', answer: 43, visual: '🟦🟦🟦🟦  🟨🟨🟨' }])
    render(<Practice topic={topic} onHome={vi.fn()} onBack={vi.fn()} />)
    const decenas = screen.getByText('🟦🟦🟦🟦')
    const unidades = screen.getByText('🟨🟨🟨')
    expect(decenas).not.toBe(unidades)
    expect(decenas.parentElement).toBe(unidades.parentElement)
  })

  it('los bloques van juntos si caben y, si no, cada uno en su línea y centrados', () => {
    expect(regla('.visual')).toMatch(/display:\s*flex/)
    expect(regla('.visual')).toMatch(/flex-wrap:\s*wrap/)
    expect(regla('.visual')).toMatch(/justify-content:\s*center/)
    expect(regla('.visual-part')).toMatch(/word-break:\s*break-all/)
  })
})

describe('Practice: separación entre la pregunta y lo que se contesta', () => {
  const conDibujo = topicFrom([
    { type: 'choice', question: '¿Qué signo va en el recuadro?', options: ['>', '<'], answer: '>', visual: '83  ❓  38' },
  ])

  it('con dibujo, el espacio del mensaje de ánimo va justo después de la pregunta y el dibujo después', () => {
    render(<Practice topic={conDibujo} onHome={vi.fn()} onBack={vi.fn()} />)
    const pregunta = screen.getByRole('heading', { name: '¿Qué signo va en el recuadro?' })
    const animo = screen.getByRole('status')
    const dibujo = screen.getByText('83')
    const opcion = screen.getByRole('button', { name: '>' })
    const despues = (a: Element, b: Element) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
    expect(despues(pregunta, animo)).toBe(true)
    expect(despues(animo, dibujo)).toBe(true)
    expect(despues(dibujo, opcion)).toBe(true)
  })

  it('sin dibujo, el orden es pregunta, espacio del mensaje y opciones', () => {
    const sinDibujo = topicFrom([{ type: 'choice', question: '¿Qué número va después del 39?', options: ['38', '40', '49'], answer: '40' }])
    render(<Practice topic={sinDibujo} onHome={vi.fn()} onBack={vi.fn()} />)
    const animo = screen.getByRole('status')
    const opcion = screen.getByRole('button', { name: '40' })
    expect(animo.compareDocumentPosition(opcion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('al acertar, el dibujo se sigue viendo bajo la pregunta', async () => {
    render(<Practice topic={conDibujo} onHome={vi.fn()} onBack={vi.fn()} />)
    await userEvent.setup().click(screen.getByRole('button', { name: '>' }))
    expect(screen.getByText('83')).toBeInTheDocument()
    expect(screen.getByText('¡Muy bien!')).toBeInTheDocument()
  })
})

describe('Practice: ejercicios con un texto para leer', () => {
  const conTexto = topicFrom([
    {
      type: 'choice',
      question: '¿Adónde va la tortuga?',
      text: 'La tortuga va al río. Camina muy despacio.',
      options: ['al río', 'al mar', 'al cole'],
      answer: 'al río',
    },
  ])

  it('muestra el texto antes de las opciones y lo sigue mostrando al acertar', async () => {
    render(<Practice topic={conTexto} onHome={vi.fn()} onBack={vi.fn()} />)
    const texto = screen.getByText('La tortuga va al río. Camina muy despacio.')
    const opcion = screen.getByRole('button', { name: 'al río' })
    expect(texto.compareDocumentPosition(opcion) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await userEvent.setup().click(opcion)
    expect(screen.getByText('La tortuga va al río. Camina muy despacio.')).toBeInTheDocument()
  })

  it('el botón de escuchar lee el texto y después la pregunta', async () => {
    render(<Practice topic={conTexto} onHome={vi.fn()} onBack={vi.fn()} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Escuchar' }))
    expect(speak).toHaveBeenLastCalledWith('La tortuga va al río. Camina muy despacio. ¿Adónde va la tortuga?')
  })

  it('sin texto, escucha solo la pregunta y no aparece la tarjeta de lectura', async () => {
    render(<Practice topic={tema} onHome={vi.fn()} onBack={vi.fn()} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Escuchar' }))
    expect(speak).toHaveBeenLastCalledWith('¿Qué número va después del 39?')
    expect(document.querySelectorAll('.reading-text')).toHaveLength(0)
  })

  it('la tarjeta de lectura tiene su propio estilo', () => {
    expect(css).toMatch(/\.reading-text\s*\{/)
  })
})
