// Números aleatorios inyectables: en la web se siembran al azar y en los tests con una semilla fija.
export type Rng = () => number

// Generador pequeño y repetible (mulberry32): la misma semilla da siempre la misma secuencia
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Generador para la web, sembrado al azar en cada sesión
export const randomRng = (): Rng => mulberry32(Math.floor(Math.random() * 2 ** 32))

// Entero entre min y max, ambos incluidos
export const int = (rng: Rng, min: number, max: number): number => min + Math.floor(rng() * (max - min + 1))

export const pick = <T>(rng: Rng, items: readonly T[]): T => items[int(rng, 0, items.length - 1)]

// Devuelve una copia barajada (Fisher-Yates); no modifica la lista original
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = int(rng, 0, i)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
