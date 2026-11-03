// Cómo se lee un número de 10 a 999
const HASTA_29 = [
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]
const DECENAS = ['treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
const UNIDADES = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']
// «ciento» va delante de otro número (ciento uno); el 100 solo es «cien» (ver `nombreNumero`)
const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos']

function dosCifras(n: number): string {
  if (n < 30) return HASTA_29[n - 10]
  const decena = DECENAS[Math.floor(n / 10) - 3]
  return n % 10 === 0 ? decena : `${decena} y ${UNIDADES[(n % 10) - 1]}`
}

export function nombreNumero(n: number): string {
  if (!Number.isInteger(n) || n < 10 || n > 999) throw new Error(`Solo hay nombres para números del 10 al 999: ${n}`)
  if (n < 100) return dosCifras(n)
  const centenas = Math.floor(n / 100)
  const resto = n % 100
  if (resto === 0) return centenas === 1 ? 'cien' : CENTENAS[centenas]
  return `${CENTENAS[centenas]} ${resto < 10 ? UNIDADES[resto - 1] : dosCifras(resto)}`
}
