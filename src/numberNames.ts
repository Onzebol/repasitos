// Cómo se lee un número de dos cifras (10 a 99)
const HASTA_29 = [
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]
const DECENAS = ['treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
const UNIDADES = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']

export function nombreNumero(n: number): string {
  if (!Number.isInteger(n) || n < 10 || n > 99) throw new Error(`Solo hay nombres para números de dos cifras: ${n}`)
  if (n < 30) return HASTA_29[n - 10]
  const decena = DECENAS[Math.floor(n / 10) - 3]
  return n % 10 === 0 ? decena : `${decena} y ${UNIDADES[(n % 10) - 1]}`
}
