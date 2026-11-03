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

// Del 100 al 999, también escrita a mano: «cien» solo para el 100 y «ciento» del 101 al 199; las centenas irregulares
// (quinientos, setecientos, novecientos) y los casos de una sola palabra con tilde (dieciséis, veintidós…)
const TABLA_CENTENAS: Record<number, string> = {
  100: 'cien',
  101: 'ciento uno',
  102: 'ciento dos',
  109: 'ciento nueve',
  110: 'ciento diez',
  111: 'ciento once',
  115: 'ciento quince',
  116: 'ciento dieciséis',
  120: 'ciento veinte',
  121: 'ciento veintiuno',
  122: 'ciento veintidós',
  126: 'ciento veintiséis',
  130: 'ciento treinta',
  131: 'ciento treinta y uno',
  143: 'ciento cuarenta y tres',
  150: 'ciento cincuenta',
  157: 'ciento cincuenta y siete',
  170: 'ciento setenta',
  183: 'ciento ochenta y tres',
  199: 'ciento noventa y nueve',
  200: 'doscientos',
  201: 'doscientos uno',
  300: 'trescientos',
  345: 'trescientos cuarenta y cinco',
  400: 'cuatrocientos',
  500: 'quinientos',
  512: 'quinientos doce',
  600: 'seiscientos',
  700: 'setecientos',
  777: 'setecientos setenta y siete',
  800: 'ochocientos',
  900: 'novecientos',
  999: 'novecientos noventa y nueve',
}

describe('nombreNumero: cómo se lee un número del 10 al 999', () => {
  it.each(Object.entries(TABLA))('%s se lee «%s»', (n, nombre) => {
    expect(nombreNumero(Number(n))).toBe(nombre)
  })

  it.each(Object.entries(TABLA_CENTENAS))('%s se lee «%s»', (n, nombre) => {
    expect(nombreNumero(Number(n))).toBe(nombre)
  })

  it('no hay dos números con el mismo nombre', () => {
    const nombres = Array.from({ length: 990 }, (_, i) => nombreNumero(i + 10))
    expect(new Set(nombres).size).toBe(990)
  })

  it('«cien» es solo el 100 y todo lo demás de 101 a 199 empieza por «ciento»', () => {
    expect(nombreNumero(100)).toBe('cien')
    for (let n = 101; n <= 199; n++) expect(nombreNumero(n), String(n)).toMatch(/^ciento /)
  })

  it('las centenas redondas del 200 al 900 son una sola palabra que acaba en «ientos» (quinientos es la irregular)', () => {
    for (let c = 2; c <= 9; c++) expect(nombreNumero(c * 100), String(c * 100)).toMatch(/^[a-z]+ientos$/)
  })

  it('de treinta en adelante, las decenas con unidades se escriben «decena y unidad» en minúsculas y sin tildes sobrantes', () => {
    for (let n = 31; n <= 99; n++) {
      if (n % 10 === 0) continue
      expect(nombreNumero(n), String(n)).toMatch(/^(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa) y (uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)$/)
    }
  })

  it('solo admite números enteros del 10 al 999', () => {
    expect(() => nombreNumero(9)).toThrow()
    expect(() => nombreNumero(1000)).toThrow()
    expect(() => nombreNumero(12.5)).toThrow()
  })
})
