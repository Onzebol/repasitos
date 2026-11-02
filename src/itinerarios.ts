import { int, pick, shuffle } from './random'
import type { Rng } from './random'
import { describeSteps, followSteps, formatSteps, parseSteps, stepsFromPath } from './route'
import type { Cell, Dir } from './route'
import type { ChoiceExercise } from './types'

// Mapas de los itinerarios con flechas (Planos e itinerarios, unidad 1): una cuadrícula de 4 filas × 5 columnas con un
// camino de 2 o 3 tramos rectos, lugares (el colegio, la tienda…) y adornos. Los dibujos son propios, no los del libro.
export const MAPA_FILAS = 4
export const MAPA_COLUMNAS = 5

export const REPI = '🦊' // sale de la casilla de salida
export const META = '🏁' // marca el final del camino cuando no hay un lugar

export const LUGARES: Record<string, { nombre: string }> = {
  '🏫': { nombre: 'el colegio' },
  '🏪': { nombre: 'la tienda' },
  '⛲': { nombre: 'la fuente' },
  '🏥': { nombre: 'el hospital' },
  '🎡': { nombre: 'la noria' },
  '🏰': { nombre: 'el castillo' },
}

// Casillas de hierba: algunas llevan un adorno (nunca el camino ni los lugares)
export const ADORNOS = ['🌳', '🌲', '🌷', '🌻']

const claveDe = ([fila, columna]: Cell) => `${fila},${columna}`

// Cuánto sitio hay desde una casilla en una dirección sin salirse del mapa
function sitio([fila, columna]: Cell, dir: Dir): number {
  return { '>': MAPA_COLUMNAS - 1 - columna, '<': columna, '^': fila, v: MAPA_FILAS - 1 - fila }[dir]
}

// Un camino al azar de 2 o 3 tramos rectos que alternan horizontal y vertical, sin repetir casillas y con al menos 3 pasos
function caminoAleatorio(rng: Rng): Cell[] {
  for (let intento = 0; intento < 1000; intento++) {
    let horizontal = pick(rng, [true, false])
    let actual: Cell = [int(rng, 0, MAPA_FILAS - 1), int(rng, 0, MAPA_COLUMNAS - 1)]
    const camino: Cell[] = [actual]
    for (let tramo = 0, tramos = int(rng, 2, 3); tramo < tramos; tramo++) {
      const posibles = (horizontal ? ['>', '<'] : ['^', 'v']).filter((dir) => sitio(actual, dir as Dir) > 0) as Dir[]
      if (posibles.length === 0) break
      const dir = pick(rng, posibles)
      const pasos = followSteps(actual, [{ n: int(rng, 1, sitio(actual, dir)), dir }]).slice(1)
      camino.push(...pasos)
      actual = pasos.at(-1)!
      horizontal = !horizontal
    }
    if (camino.length >= 4 && new Set(camino.map(claveDe)).size === camino.length) return camino
  }
  throw new Error('No se ha podido crear un camino')
}

// El mapa vacío: hierba con adornos en algunas casillas libres. `ocupadas` son el camino y los lugares ya colocados
function mapaConAdornos(ocupadas: Set<string>, rng: Rng): string[][] {
  return Array.from({ length: MAPA_FILAS }, (_, fila) =>
    Array.from({ length: MAPA_COLUMNAS }, (_, columna) => (ocupadas.has(claveDe([fila, columna])) || int(rng, 0, 9) >= 4 ? '' : pick(rng, ADORNOS))),
  )
}

const casillasLibres = (ocupadas: Set<string>): Cell[] =>
  Array.from({ length: MAPA_FILAS * MAPA_COLUMNAS }, (_, i): Cell => [Math.floor(i / MAPA_COLUMNAS), i % MAPA_COLUMNAS]).filter((c) => !ocupadas.has(claveDe(c)))

const etiquetasDeLugares = (lugares: string[]) => Object.fromEntries(lugares.map((l) => [l, LUGARES[l].nombre]))

// Tres lugares distintos: el de la respuesta y dos más
const tresLugares = (rng: Rng) => shuffle(rng, Object.keys(LUGARES)).slice(0, 3)

export function generarItinerario(ask: 'where' | 'which' | 'passes', rng: Rng): ChoiceExercise {
  const camino = caminoAleatorio(rng)
  const salida = camino[0]
  const meta = camino.at(-1)!
  const ocupadas = new Set(camino.map(claveDe))

  if (ask === 'where') {
    // Las flechas no se dibujan en el mapa: hay que seguirlas. Los otros dos lugares quedan fuera del camino
    const [llegada, ...otros] = tresLugares(rng)
    const sitios = shuffle(rng, casillasLibres(ocupadas)).slice(0, 2)
    sitios.forEach((c) => ocupadas.add(claveDe(c)))
    const cells = mapaConAdornos(ocupadas, rng)
    cells[meta[0]][meta[1]] = llegada
    otros.forEach((lugar, i) => (cells[sitios[i][0]][sitios[i][1]] = lugar))
    return {
      type: 'choice',
      question: 'Sigue las flechas desde Repi. ¿Dónde llegas?',
      options: [llegada, ...otros],
      answer: llegada,
      labels: etiquetasDeLugares([llegada, ...otros]),
      steps: formatSteps(stepsFromPath(camino)),
      route: { cells, start: salida },
    }
  }

  if (ask === 'which') {
    const llegada = pick(rng, Object.keys(LUGARES))
    const cells = mapaConAdornos(ocupadas, rng)
    cells[meta[0]][meta[1]] = llegada
    const correcta = stepsFromPath(camino)
    // Equivocadas: un paso con una unidad más o menos, o en la dirección contraria, y que no llegue a la meta
    const variantes = correcta.flatMap((paso, i) => {
      const cambios = [{ ...paso, n: paso.n + 1 }, { ...paso, n: paso.n - 1 }, { ...paso, dir: ({ '>': '<', '<': '>', '^': 'v', v: '^' } as const)[paso.dir] }]
      return cambios.filter((cambio) => cambio.n >= 1).map((cambio) => correcta.map((p, j) => (j === i ? cambio : p)))
    })
    const llegaAlli = (pasos: ReturnType<typeof parseSteps>) => followSteps(salida, pasos).at(-1)!.join() === meta.join()
    const equivocadas = shuffle(rng, [...new Set(variantes.filter((v) => !llegaAlli(v)).map(formatSteps))]).slice(0, 2)
    const respuesta = formatSteps(correcta)
    const opciones = [respuesta, ...equivocadas]
    return {
      type: 'choice',
      question: `¿Qué itinerario lleva a Repi hasta ${LUGARES[llegada].nombre}?`,
      options: opciones,
      answer: respuesta,
      labels: Object.fromEntries(opciones.map((o) => [o, describeSteps(parseSteps(o))])),
      stepOptions: true,
      route: { cells, start: salida, path: camino, arrows: true },
    }
  }

  // passes: el camino pasa por un lugar y los otros dos quedan fuera; el final se marca con una bandera
  const [alPasar, ...otros] = tresLugares(rng)
  const interior = pick(rng, camino.slice(1, -1))
  const sitios = shuffle(rng, casillasLibres(ocupadas)).slice(0, 2)
  sitios.forEach((c) => ocupadas.add(claveDe(c)))
  const cells = mapaConAdornos(ocupadas, rng)
  cells[meta[0]][meta[1]] = META
  cells[interior[0]][interior[1]] = alPasar
  otros.forEach((lugar, i) => (cells[sitios[i][0]][sitios[i][1]] = lugar))
  return {
    type: 'choice',
    question: '¿Por qué sitio pasa el camino?',
    options: [alPasar, ...otros],
    answer: alPasar,
    labels: etiquetasDeLugares([alPasar, ...otros]),
    route: { cells, start: salida, path: camino, arrows: true },
  }
}
