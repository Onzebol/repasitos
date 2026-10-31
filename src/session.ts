import { generate } from './generators'
import { shuffle } from './random'
import type { Rng } from './random'
import type { Exercise, PlanBlock } from './types'

// Ejercicios por sesión
export const SESSION_SIZE = 10

// Con pocas opciones (las diez cifras del trazo) hacen falta muchos intentos para dar con la última que queda libre
const MAX_TRIES = 300

// Identifica un ejercicio por sus datos (no por el enunciado, que se repite en las columnas o los signos)
export function exerciseKey(exercise: Exercise): string {
  switch (exercise.type) {
    case 'choice':
      // Con identidad de hecho, lo que cuenta es el hecho y no las opciones (así no se pregunta dos veces lo mismo en una sesión)
      if (exercise.fact !== undefined) return JSON.stringify([exercise.type, 'fact', exercise.fact])
      return JSON.stringify([exercise.type, exercise.question, exercise.visual, exercise.answer, [...exercise.options].sort()])
    case 'number':
      return JSON.stringify([exercise.type, exercise.question, exercise.visual, exercise.answer])
    case 'trace':
      return JSON.stringify([exercise.type, exercise.digit])
    case 'column':
      return JSON.stringify([exercise.type, exercise.operator, exercise.top, exercise.bottom, exercise.carry ?? false])
  }
}

function pickDistinct(block: PlanBlock, rng: Rng, used: Set<string>): Exercise {
  const { spec } = block
  if (spec.kind === 'bag') {
    const disponibles = spec.items.filter((item) => !used.has(exerciseKey(item)))
    if (disponibles.length === 0) throw new Error('No hay suficientes ejercicios distintos en la lista del plan')
    return shuffle(rng, disponibles)[0]
  }
  for (let i = 0; i < MAX_TRIES; i++) {
    const exercise = generate(spec, rng)
    if (!used.has(exerciseKey(exercise))) return exercise
  }
  throw new Error(`No hay suficientes ejercicios distintos con la plantilla ${JSON.stringify(spec)}`)
}

function attempt(plan: PlanBlock[], rng: Rng, avoid: string[]): Exercise[] {
  const used = new Set(avoid)
  const session: Exercise[] = []
  for (const block of plan) {
    for (let i = 0; i < block.count; i++) {
      const exercise = pickDistinct(block, rng, used)
      used.add(exerciseKey(exercise))
      session.push(exercise)
    }
  }
  return session
}

// Crea una sesión nueva a partir del plan de un tema: sigue el orden de los bloques, no repite
// ejercicios dentro de la sesión y baraja las opciones. Con `avoid` (claves de la sesión anterior)
// intenta no repetirlos, pero si no hay donde elegir los admite antes que quedarse sin sesión.
export function buildSession(plan: PlanBlock[], rng: Rng, avoid: string[] = []): Exercise[] {
  let session: Exercise[]
  try {
    session = attempt(plan, rng, avoid)
  } catch (error) {
    if (avoid.length === 0) throw error
    session = attempt(plan, rng, [])
  }
  return session.map((exercise) =>
    exercise.type === 'choice' ? { ...exercise, options: shuffle(rng, exercise.options) } : exercise,
  )
}
