import type { Topic, Unit } from '../../types'
import type { Letra } from '../trazos-letras'

// Letras de 3º de Infantil (#86): primero conciencia fonológica, sin leer: rimas y sonido inicial, con dibujos y la
// pregunta en voz alta. Las consonantes, las vocales y el trazo de letras ligadas llegan en otras issues. Ejercicios
// escritos desde cero.
// Trazo de letras con el dedo (#99). El orden del cuaderno de clase no se conoce: vocales primero, luego las consonantes
// que más se suelen presentar al principio (m, s, l, p, t, n, r, d) y el resto del abecedario. Cada tanda se repasa en
// minúscula (ligada) y en mayúscula. PENDIENTE de contrastar con el cuaderno (#5).
const VOCALES: Letra[] = ['A', 'E', 'I', 'O', 'U']
const CONSONANTES_PRIMERAS: Letra[] = ['M', 'S', 'L', 'P', 'T', 'N', 'R', 'D']
const CONSONANTES_RESTO: Letra[] = ['B', 'C', 'F', 'G', 'H', 'J', 'K', 'Ñ', 'Q', 'V', 'W', 'X', 'Y', 'Z']
const trazoDe = (letters: Letra[]) => [
  { spec: { kind: 'trace' as const, letters, lowercase: true }, count: 5 },
  { spec: { kind: 'trace' as const, letters }, count: 5 },
]

export const temasLetras: Topic[] = [
  {
    id: 'rimas',
    name: 'Rimas',
    icon: '🎵',
    tint: '#ffd1dc',
    plan: [{ spec: { kind: 'rhyme' }, count: 10 }],
  },
  {
    id: 'sonido-inicial',
    name: 'Con qué sonido empieza',
    icon: '👂',
    tint: '#bfe3ff',
    plan: [{ spec: { kind: 'initial-sound' }, count: 10 }],
  },
  {
    id: 'trazo-vocales',
    name: 'Trazo de las vocales',
    icon: '✍️',
    tint: '#ffe9a8',
    plan: trazoDe(VOCALES),
  },
  {
    id: 'trazo-consonantes',
    name: 'Trazo de m, s, l, p, t, n, r, d',
    icon: '🖍️',
    tint: '#ffd9b3',
    plan: trazoDe(CONSONANTES_PRIMERAS),
  },
  {
    id: 'trazo-resto',
    name: 'Trazo de las demás letras',
    icon: '🖊️',
    tint: '#f5c6e8',
    plan: trazoDe(CONSONANTES_RESTO),
  },
]

// En Infantil no hay unidades: Letras muestra sus temas directamente (ver src/routes.ts)
export const unidadLetras: Unit = {
  id: 'letras',
  name: 'Letras',
  note: '',
  icon: '🔤',
  tint: '#cdb9ff',
  topics: temasLetras,
}
