import { describe, expect, it } from 'vitest'
import { int, mulberry32, pick, shuffle } from './random'

const secuencia = (seed: number, n = 8) => {
  const rng = mulberry32(seed)
  return Array.from({ length: n }, () => rng())
}

describe('mulberry32: números aleatorios con semilla', () => {
  it('con la misma semilla sale la misma secuencia', () => {
    expect(secuencia(42)).toEqual(secuencia(42))
  })

  it('con otra semilla sale otra secuencia', () => {
    expect(secuencia(1)).not.toEqual(secuencia(2))
  })

  it('da números en [0, 1)', () => {
    for (const n of secuencia(7, 500)) {
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(1)
    }
  })
})

describe('int, pick y shuffle', () => {
  it('int incluye los dos extremos y nunca se sale del rango', () => {
    const rng = mulberry32(3)
    const vistos = new Set<number>()
    for (let i = 0; i < 500; i++) vistos.add(int(rng, 2, 5))
    expect([...vistos].sort()).toEqual([2, 3, 4, 5])
  })

  it('int con los extremos iguales devuelve ese número', () => {
    expect(int(mulberry32(1), 4, 4)).toBe(4)
  })

  it('pick elige un elemento de la lista', () => {
    const rng = mulberry32(5)
    for (let i = 0; i < 50; i++) expect(['a', 'b', 'c']).toContain(pick(rng, ['a', 'b', 'c']))
  })

  it('shuffle conserva los elementos, no toca la lista original y cambia el orden según la semilla', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8]
    const barajada = shuffle(mulberry32(9), original)
    expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect([...barajada].sort()).toEqual(original)
    expect(shuffle(mulberry32(9), original)).toEqual(barajada)
    expect(shuffle(mulberry32(10), original)).not.toEqual(barajada)
  })
})
