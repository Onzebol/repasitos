import type { Point, Stroke } from './infantil/trazos'

// Seguimiento del trazo guiado de una cifra (#50): lógica pura, sin pantalla. Las distancias están en las
// unidades del cuadro de dibujo de src/infantil/trazos.ts (100 de ancho × 140 de alto).
//
// Cada trazo se divide en puntos a la misma distancia (la guía). El dedo debe empezar cerca de la salida y va
// "alcanzando" los puntos en orden, así que la salida marca el sentido. Como los movimientos del dedo en una
// tableta llegan espaciados, se mira el segmento entre la posición anterior y la actual y se pueden alcanzar
// varios puntos seguidos de golpe, pero solo unos pocos hacia delante: no se puede saltar de la salida a la llegada.
// Si el dedo se aleja del camino, se reinicia solo el trazo en curso (sin penalizar: es un «¡Casi!»).

export const SPACING = 3 // distancia entre los puntos de la guía
export const START_TOLERANCE = 14 // lo cerca de la salida que hay que empezar
export const TOLERANCE = 12 // lo cerca del camino que hay que pasar para alcanzar un punto
export const OFF_TOLERANCE = 14 // a partir de aquí el dedo «se ha salido»
export const LOOKAHEAD = 8 // puntos que se pueden alcanzar de una vez (8 × 3 = 24 unidades)

export type Guide = Point[][]

export type TraceState = {
  stroke: number // trazo en curso
  reached: number // último punto alcanzado de ese trazo (-1: sin empezar)
  done: boolean // cifra completa
  slipped: boolean // el último movimiento sacó el dedo del camino
}

export const initialState: TraceState = { stroke: 0, reached: -1, done: false, slipped: false }

const dist = ([ax, ay]: Point, [bx, by]: Point) => Math.hypot(ax - bx, ay - by)

// Distancia de un punto a un segmento
function distToSegment(point: Point, [ax, ay]: Point, [bx, by]: Point): number {
  const dx = bx - ax
  const dy = by - ay
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((point[0] - ax) * dx + (point[1] - ay) * dy) / lengthSquared))
  return dist(point, [ax + t * dx, ay + t * dy])
}

// Puntos a la misma distancia a lo largo del trazo (por longitud, no por número de puntos), con el primero y el último
export function resample(stroke: Stroke, spacing = SPACING): Point[] {
  const result: Point[] = [stroke[0]]
  let next = spacing // longitud recorrida a la que toca el siguiente punto
  let walked = 0
  for (let i = 1; i < stroke.length; i++) {
    const [ax, ay] = stroke[i - 1]
    const [bx, by] = stroke[i]
    const length = Math.hypot(bx - ax, by - ay)
    while (next <= walked + length + 1e-9) {
      const t = (next - walked) / length
      result.push([ax + (bx - ax) * t, ay + (by - ay) * t])
      next += spacing
    }
    walked += length
  }
  const last = stroke[stroke.length - 1]
  if (dist(result[result.length - 1], last) > 1e-6) result.push(last)
  return result
}

export const createGuide = (strokes: Stroke[]): Guide => strokes.map((stroke) => resample(stroke))

// Mueve el dedo de `prev` (si lo había) a `cur`
export function advance(guide: Guide, state: TraceState, prev: Point | null, cur: Point): TraceState {
  if (state.done) return state
  const points = guide[state.stroke]
  let reached = state.reached

  // Sin empezar: hay que entrar por la salida
  if (reached < 0) {
    if (dist(cur, points[0]) > START_TOLERANCE) return state.slipped ? { ...state, slipped: false } : state
    reached = 0
  }

  // Alcanza los puntos siguientes uno a uno mientras el movimiento los deja cerca (hasta LOOKAHEAD). Tiene que ser
  // seguido: así en curvas cerradas, como la del 3, no se salta a un punto que está cerca pero mucho más adelante.
  const from = prev ?? cur
  const limit = Math.min(reached + LOOKAHEAD, points.length - 1)
  while (reached < limit && distToSegment(points[reached + 1], from, cur) <= TOLERANCE) reached++

  // El dedo se sale del camino: se reinicia este trazo
  const first = Math.max(0, reached - LOOKAHEAD)
  const last = Math.min(points.length - 1, reached + LOOKAHEAD)
  let onPath = false
  for (let k = first; k <= last && !onPath; k++) onPath = dist(cur, points[k]) <= OFF_TOLERANCE
  if (!onPath) return { stroke: state.stroke, reached: -1, done: false, slipped: true }

  // Trazo terminado: sigue el siguiente o la cifra está completa
  if (reached >= points.length - 1) {
    return state.stroke + 1 < guide.length
      ? { stroke: state.stroke + 1, reached: -1, done: false, slipped: false }
      : { stroke: state.stroke, reached, done: true, slipped: false }
  }
  return { stroke: state.stroke, reached, done: false, slipped: false }
}

// Se levanta el dedo: si el trazo no estaba terminado, empieza otra vez (sin avisos)
export function lift(state: TraceState): TraceState {
  if (state.done || (state.reached < 0 && !state.slipped)) return state
  return { stroke: state.stroke, reached: -1, done: false, slipped: false }
}

// Lo ya recorrido, para pintarlo: los trazos terminados enteros y el actual hasta donde se ha llegado
export function traced(guide: Guide, state: TraceState): Point[][] {
  return guide.slice(0, state.stroke + 1).map((points, i) => (i < state.stroke ? points : points.slice(0, state.reached + 1)))
}
