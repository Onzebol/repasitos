import { describe, expect, it } from 'vitest'
import { nombreNumero } from './numberNames'

// Tabla escrita a mano, independiente del código: las irregulares (10 a 31) y una muestra de cada decena
const TABLA: Record<number, string> = {
  10: 'diez',
  11: 'once',
  12: 'doce',
  13: 'trece',
  14: 'catorce',
  15: 'quince',
  16: 'dieciséis',
  17: 'diecisiete',
  18: 'dieciocho',
  19: 'diecinueve',
  20: 'veinte',
  21: 'veintiuno',
  22: 'veintidós',
  23: 'veintitrés',
  24: 'veinticuatro',
  25: 'veinticinco',
  26: 'veintiséis',
  27: 'veintisiete',
  28: 'veintiocho',
  29: 'veintinueve',
  30: 'treinta',
  31: 'treinta y uno',
  32: 'treinta y dos',
  40: 'cuarenta',
  43: 'cuarenta y tres',
  50: 'cincuenta',
  54: 'cincuenta y cuatro',
  60: 'sesenta',
  68: 'sesenta y ocho',
  70: 'setenta',
  73: 'setenta y tres',
  80: 'ochenta',
  86: 'ochenta y seis',
  90: 'noventa',
  91: 'noventa y uno',
  99: 'noventa y nueve',
}

describe('nombreNumero: cómo se lee un número del 10 al 99', () => {
  it.each(Object.entries(TABLA))('%s se lee «%s»', (n, nombre) => {
    expect(nombreNumero(Number(n))).toBe(nombre)
  })

  it('no hay dos números con el mismo nombre', () => {
    const nombres = Array.from({ length: 90 }, (_, i) => nombreNumero(i + 10))
    expect(new Set(nombres).size).toBe(90)
  })

  it('de treinta en adelante, las decenas con unidades se escriben «decena y unidad» en minúsculas y sin tildes sobrantes', () => {
    for (let n = 31; n <= 99; n++) {
      if (n % 10 === 0) continue
      expect(nombreNumero(n), String(n)).toMatch(/^(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa) y (uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)$/)
    }
  })

  it('solo admite números de dos cifras', () => {
    expect(() => nombreNumero(9)).toThrow()
    expect(() => nombreNumero(100)).toThrow()
    expect(() => nombreNumero(12.5)).toThrow()
  })
})
