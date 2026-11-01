import type { Topic, Unit } from '../../types'

// Letras de 3º de Infantil (#86): primero conciencia fonológica, sin leer: rimas y sonido inicial, con dibujos y la
// pregunta en voz alta. Las consonantes, las vocales y el trazo de letras ligadas llegan en otras issues. Ejercicios
// escritos desde cero.
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
