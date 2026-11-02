import { describe, expect, it, vi } from 'vitest'
import emojiFont from './assets/emoji-font.css?raw'
import { emojisDeLaFuente } from './emojiFont'
import { generate } from './generators'
import { ADORNOS, LUGARES, MAPA_COLUMNAS, MAPA_FILAS, OBSTACULOS, REPI } from './itinerarios'
import { mulberry32 } from './random'
import { describeSteps, followSteps, formatSteps, parseSteps, runProgram } from './route'
import type { BlockSpec, ChoiceExercise } from './types'

const SEMILLAS = 300

// Cada test recorre 300 mapas con muchas comprobaciones: con todos los tests corriendo a la vez pueden pasar de los 5 s por defecto
vi.setConfig({ testTimeout: 30_000 })

// Tabla escrita a mano, independiente del código: dibujo de cada lugar y cómo se nombra
const NOMBRES: Record<string, string> = {
  '🏫': 'el colegio',
  '🏪': 'la tienda',
  '⛲': 'la fuente',
  '🏥': 'el hospital',
  '🎡': 'la noria',
  '🏰': 'el castillo',
}

const muchos = (spec: BlockSpec): ChoiceExercise[] =>
  Array.from({ length: SEMILLAS }, (_, seed) => {
    const e = generate(spec, mulberry32(seed))
    if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
    return e
  })

type Casilla = [number, number]
const dentro = ([r, c]: Casilla) => r >= 0 && r < 4 && c >= 0 && c < 5
const mismo = (a: Casilla, b: Casilla) => a[0] === b[0] && a[1] === b[1]

// Dónde está cada lugar dibujado en el mapa
function lugaresEn(e: ChoiceExercise): { dibujo: string; casilla: Casilla }[] {
  const encontrados: { dibujo: string; casilla: Casilla }[] = []
  e.route!.cells.forEach((fila, r) => fila.forEach((dibujo, c) => dibujo in NOMBRES && encontrados.push({ dibujo, casilla: [r, c] })))
  return encontrados
}

// Lo que cumple cualquier camino: dentro del mapa, casillas contiguas, sin repetir y con al menos tres pasos
function comprobarCamino(camino: Casilla[], texto: string) {
  expect(camino.length, texto).toBeGreaterThanOrEqual(4)
  for (const casilla of camino) expect(dentro(casilla), `${texto} → ${casilla}`).toBe(true)
  expect(new Set(camino.map((c) => c.join(','))).size, texto).toBe(camino.length)
  for (let i = 1; i < camino.length; i++) {
    expect(Math.abs(camino[i][0] - camino[i - 1][0]) + Math.abs(camino[i][1] - camino[i - 1][1]), texto).toBe(1)
  }
}

describe('el mapa de los itinerarios', () => {
  it('mide 4 filas × 5 columnas y todo lo que se dibuja sale de la fuente de emojis', () => {
    expect([MAPA_FILAS, MAPA_COLUMNAS]).toEqual([4, 5])
    const fuente = new Set(emojisDeLaFuente(emojiFont))
    for (const dibujo of [REPI, ...Object.keys(LUGARES), ...ADORNOS.filter((a) => a !== '')]) {
      expect(fuente.has(dibujo), dibujo).toBe(true)
    }
  })

  it('los lugares y sus nombres son los de la tabla de referencia', () => {
    expect(Object.fromEntries(Object.entries(LUGARES).map(([emoji, lugar]) => [emoji, lugar.nombre]))).toEqual(NOMBRES)
  })
})

describe('itinerarios: seguir las flechas («¿dónde llegas?»)', () => {
  it('las flechas llevan a Repi a uno de los tres lugares dibujados, que es la respuesta', () => {
    for (const e of muchos({ kind: 'route', ask: 'where' })) {
      expect(e.question).toBe('Sigue las flechas desde Repi. ¿Dónde llegas?')
      const mapa = e.route!
      expect(mapa.cells).toHaveLength(4)
      for (const fila of mapa.cells) expect(fila).toHaveLength(5)
      expect(mapa.path, e.steps).toBeUndefined() // el camino no se dibuja: hay que seguir las flechas
      expect(mapa.arrows, e.steps).toBeFalsy()
      expect(mapa.cells[mapa.start[0]][mapa.start[1]], 'Repi sale de una casilla libre').toBe('')

      const pasos = parseSteps(e.steps!)
      for (let i = 1; i < pasos.length; i++) expect(pasos[i].dir, e.steps).not.toBe(pasos[i - 1].dir)
      const camino = followSteps(mapa.start, pasos)
      comprobarCamino(camino, e.steps!)
      expect(mapa.cells[camino.at(-1)![0]][camino.at(-1)![1]], e.steps).toBe(e.answer)

      expect(e.options).toHaveLength(3)
      const lugares = lugaresEn(e)
      expect(lugares.map((l) => l.dibujo).sort(), 'tres lugares distintos').toEqual([...e.options].sort())
      for (const opcion of e.options) expect(e.labels![opcion], opcion).toBe(NOMBRES[opcion])
      // los otros dos lugares no están en el camino
      for (const { dibujo, casilla } of lugares) {
        if (dibujo !== e.answer) expect(camino.some((c) => mismo(c, casilla)), `${e.steps} pasa por ${dibujo}`).toBe(false)
      }
    }
  })
})

describe('itinerarios: elegir el itinerario («¿qué itinerario lleva…?»)', () => {
  it('el camino dibujado sale de Repi, llega al lugar de la pregunta y solo una opción lo recorre', () => {
    const lugares = new Set<string>()
    for (const e of muchos({ kind: 'route', ask: 'which' })) {
      const mapa = e.route!
      const [, nombre] = e.question.match(/^¿Qué itinerario lleva a Repi hasta (.+)\?$/)!
      const dibujo = Object.keys(NOMBRES).find((d) => NOMBRES[d] === nombre)!
      expect(dibujo, e.question).toBeDefined()
      lugares.add(dibujo)

      expect(mapa.arrows, e.question).toBe(true)
      expect(e.stepOptions, e.question).toBe(true)
      expect(e.steps, e.question).toBeUndefined()
      const camino = mapa.path!
      expect(mapa.start, e.question).toEqual(camino[0])
      comprobarCamino(camino, e.question)
      const meta = camino.at(-1)!
      expect(mapa.cells[meta[0]][meta[1]], e.question).toBe(dibujo)

      // la respuesta es exactamente el camino dibujado
      expect(followSteps(mapa.start, parseSteps(e.answer)), e.question).toEqual(camino)
      expect(e.options).toHaveLength(3)
      expect(e.options).toContain(e.answer)
      for (const opcion of e.options) {
        const pasos = parseSteps(opcion)
        expect(formatSteps(pasos), opcion).toBe(opcion)
        expect(e.labels![opcion], opcion).toBe(describeSteps(pasos))
        if (opcion !== e.answer) expect(mismo(followSteps(mapa.start, pasos).at(-1)!, meta), `${opcion} también llega`).toBe(false)
      }
    }
    expect(lugares.size, 'salen todos los lugares').toBe(6)
  })
})

describe('itinerarios: por qué sitio pasa Repi', () => {
  it('se dan las instrucciones sin dibujar el camino y siguiéndolas se pasa por un solo lugar de los tres', () => {
    for (const e of muchos({ kind: 'route', ask: 'passes' })) {
      expect(e.question).toBe('¿Por qué sitio pasa Repi?')
      const mapa = e.route!
      // el camino no se pinta (se vería la respuesta): solo están las instrucciones
      expect(mapa.path, e.steps).toBeUndefined()
      expect(mapa.arrows, e.steps).toBeFalsy()
      expect(e.stepOptions).toBeFalsy()
      const pasos = parseSteps(e.steps!)
      for (let i = 1; i < pasos.length; i++) expect(pasos[i].dir, e.steps).not.toBe(pasos[i - 1].dir)
      const camino = followSteps(mapa.start, pasos)
      comprobarCamino(camino, e.steps!)
      expect(mapa.cells[mapa.start[0]][mapa.start[1]], 'Repi sale de una casilla libre').toBe('')
      // la meta no lleva bandera ni lugar: ya no hace falta
      const meta = camino.at(-1)!
      expect(mapa.cells[meta[0]][meta[1]], e.steps).toBe('')

      expect(e.options).toHaveLength(3)
      const lugares = lugaresEn(e)
      expect(lugares.map((l) => l.dibujo).sort()).toEqual([...e.options].sort())
      for (const opcion of e.options) expect(e.labels![opcion], opcion).toBe(NOMBRES[opcion])
      const porElCamino = lugares.filter((l) => camino.some((c) => mismo(c, l.casilla)))
      expect(porElCamino.map((l) => l.dibujo)).toEqual([e.answer])
    }
  })
})

describe('itinerarios: programar a Repi', () => {
  const programas = Array.from({ length: SEMILLAS }, (_, seed) => generate({ kind: 'route-program' }, mulberry32(seed)))

  it('los árboles son los dos de los adornos y bloquean', () => {
    expect([...OBSTACULOS].sort()).toEqual(['🌲', '🌳'])
    for (const arbol of OBSTACULOS) expect(ADORNOS).toContain(arbol)
  })

  it('el ejercicio pide llegar a un lugar del mapa, sin dibujar el camino ni dar el itinerario', () => {
    const lugares = new Set<string>()
    for (const e of programas) {
      if (e.type !== 'route-program') throw new Error('se esperaba programar a Repi')
      const destino = e.question.replace('Programa a Repi para que llegue ', '')
      const dibujo = { 'al colegio': '🏫', 'a la tienda': '🏪', 'a la fuente': '⛲', 'al hospital': '🏥', 'a la noria': '🎡', 'al castillo': '🏰' }[destino]!
      expect(dibujo, e.question).toBeDefined()
      expect(e.route.path, e.question).toBeUndefined()
      expect(e.route.arrows, e.question).toBeFalsy()
      expect(e.route.cells).toHaveLength(4)
      for (const fila of e.route.cells) expect(fila).toHaveLength(5)
      expect(e.route.cells[e.route.start[0]][e.route.start[1]], 'Repi sale de una casilla libre').toBe('')
      expect(e.route.cells[e.goal[0]][e.goal[1]], e.question).toBe(dibujo)
      expect(e.goal, 'la salida y la meta son distintas').not.toEqual(e.route.start)
      lugares.add(dibujo)
    }
    expect(lugares.size, 'salen todos los lugares').toBe(6)
  })

  it('hay solución: el itinerario de referencia lleva a Repi a la meta sin chocar con árboles', () => {
    for (const e of programas) {
      if (e.type !== 'route-program') throw new Error('se esperaba programar a Repi')
      const pasos = parseSteps(e.answer)
      expect(formatSteps(pasos), e.question).toBe(e.answer)
      const resultado = runProgram(e.route.cells, e.route.start, e.goal, pasos, ['🌳', '🌲'])
      expect(resultado.outcome, `${e.question}: ${e.answer}`).toBe('goal')
      expect(followSteps(e.route.start, pasos).at(-1), e.question).toEqual(e.goal)
    }
  })

  it('en la mayoría de los mapas hay árboles (si no, no habría con qué chocar)', () => {
    const conArboles = programas.filter((e) => e.type === 'route-program' && e.route.cells.flat().some((c) => OBSTACULOS.includes(c)))
    expect(conArboles.length).toBeGreaterThan(SEMILLAS / 2)
  })
})
