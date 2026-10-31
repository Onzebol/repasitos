import { int, pick } from './random'
import type { Rng } from './random'
import type { BlockSpec, ChoiceExercise, ColumnExercise, Exercise, NumberExercise } from './types'

const elegir = (question: string, options: (string | number)[], answer: string | number, visual?: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options: options.map(String),
  answer: String(answer),
  visual,
})

const numero = (question: string, answer: number, visual?: string): NumberExercise => ({
  type: 'number',
  question,
  answer,
  visual,
})

const decenas = (n: number) => `${n} ${n === 1 ? 'decena' : 'decenas'}`
const unidades = (n: number) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`

const piezas = (d: number, u: number) => `${'🟦'.repeat(d)}  ${'🟨'.repeat(u)}`

// Tres números distintos de dos cifras
function tresDistintos(rng: Rng): [number, number, number] {
  const numeros = new Set<number>()
  while (numeros.size < 3) numeros.add(int(rng, 10, 99))
  return [...numeros] as [number, number, number]
}

// Dos números de dos cifras que se suman sin llevar (cada columna por separado) y no pasan de 99
function sumandos(rng: Rng): [number, number] {
  const topTens = int(rng, 1, 8)
  const topUnits = int(rng, 0, 8)
  const bottomTens = int(rng, 1, 9 - topTens)
  const bottomUnits = int(rng, 0, 9 - topUnits)
  return [topTens * 10 + topUnits, bottomTens * 10 + bottomUnits]
}

// Minuendo y sustraendo de dos cifras que se restan sin llevar, con resultado mayor que 0
function restandos(rng: Rng): [number, number] {
  for (;;) {
    const topTens = int(rng, 2, 9)
    const topUnits = int(rng, 0, 9)
    const bottomTens = int(rng, 1, topTens)
    const bottomUnits = int(rng, 0, topUnits)
    if (topTens !== bottomTens || topUnits !== bottomUnits) {
      return [topTens * 10 + topUnits, bottomTens * 10 + bottomUnits]
    }
  }
}

const operandos = (operator: '+' | '−', rng: Rng) => (operator === '+' ? sumandos(rng) : restandos(rng))

const columna = (operator: '+' | '−', rng: Rng): ColumnExercise => {
  const [top, bottom] = operandos(operator, rng)
  return {
    type: 'column',
    question: operator === '+' ? 'Suma en columna' : 'Resta en columna',
    operator,
    top,
    bottom,
    answer: operator === '+' ? top + bottom : top - bottom,
  }
}

const HISTORIAS_SUMA: ((a: number, b: number) => string)[] = [
  (a, b) => `Tengo ${a} pegatinas y me regalan ${b}. ¿Cuántas tengo ahora?`,
  (a, b) => `En el parque hay ${a} niños y llegan ${b} más. ¿Cuántos hay ahora?`,
  (a, b) => `Una caja tiene ${a} lápices y otra tiene ${b}. ¿Cuántos lápices hay en total?`,
  (a, b) => `Leo ${a} páginas por la mañana y ${b} por la tarde. ¿Cuántas páginas leo?`,
]

const HISTORIAS_RESTA: ((a: number, b: number) => string)[] = [
  (a, b) => `En la bolsa hay ${a} canicas. Saco ${b}. ¿Cuántas quedan?`,
  (a, b) => `Tenía ${a} galletas y me como ${b}. ¿Cuántas me quedan?`,
  (a, b) => `En el autobús van ${a} personas y se bajan ${b}. ¿Cuántas siguen dentro?`,
  (a, b) => `Hay ${a} globos y se pinchan ${b}. ¿Cuántos globos quedan?`,
]

const problema = (operator: '+' | '−', rng: Rng): NumberExercise => {
  const [a, b] = operandos(operator, rng)
  const historia = pick(rng, operator === '+' ? HISTORIAS_SUMA : HISTORIAS_RESTA)
  return numero(historia(a, b), operator === '+' ? a + b : a - b)
}

// Crea un ejercicio nuevo a partir de una plantilla. Las listas fijas ('bag') las reparte buildSession.
export function generate(spec: BlockSpec, rng: Rng): Exercise {
  switch (spec.kind) {
    case 'bag':
      throw new Error('Las listas fijas no se generan: las reparte buildSession')

    case 'neighbor': {
      if (spec.mode === 'after') {
        const n = int(rng, spec.min, spec.max - 1)
        return elegir(`¿Qué número va después del ${n}?`, [n + 1, n - 1, n + 10], n + 1)
      }
      if (spec.mode === 'before') {
        const n = int(rng, spec.min + 1, spec.max)
        return elegir(`¿Qué número va antes del ${n}?`, [n - 1, n + 1, n - 10], n - 1)
      }
      const n = int(rng, spec.min + 1, spec.max - 1)
      return elegir(`¿Qué número va entre el ${n - 1} y el ${n + 1}?`, [n - 2, n, n + 2], n)
    }

    case 'extreme': {
      const opciones = tresDistintos(rng)
      const mayor = spec.mode === 'greatest'
      return elegir(
        mayor ? '¿Cuál es el número mayor?' : '¿Cuál es el número menor?',
        opciones,
        mayor ? Math.max(...opciones) : Math.min(...opciones),
      )
    }

    case 'series': {
      const inicio = int(rng, 10, 99 - 3 * spec.step)
      const mostrados = [0, 1, 2].map((i) => inicio + i * spec.step)
      return numero(`Completa la serie: ${mostrados.join(', ')}, …`, inicio + 3 * spec.step)
    }

    case 'place-value': {
      const d = int(rng, 1, 9)
      if (spec.ask === 'read') {
        // Decenas y unidades distintas y sin cero: así las opciones nunca se repiten ni suenan raras
        let u = int(rng, 1, 9)
        while (u === d) u = int(rng, 1, 9)
        const frase = (a: number, b: number) => `${decenas(a)} y ${unidades(b)}`
        return elegir(`El número ${d * 10 + u} tiene…`, [frase(d, u), frase(u, d), frase(d, d)], frase(d, u))
      }
      if (spec.ask === 'tens' || spec.ask === 'units') {
        const n = int(rng, 10, 99)
        return spec.ask === 'tens'
          ? numero(`¿Cuántas decenas tiene el ${n}?`, Math.floor(n / 10))
          : numero(`¿Cuántas unidades tiene el ${n}?`, n % 10)
      }
      if (spec.ask === 'compose') {
        const u = int(rng, 0, 9)
        return numero(`${decenas(d)} y ${unidades(u)}. ¿Qué número es?`, d * 10 + u)
      }
      const u = int(rng, 1, 9)
      return numero('🟦 es una decena y 🟨 es una unidad. ¿Qué número es?', d * 10 + u, piezas(d, u))
    }

    case 'compare': {
      const [a, b, c] = tresDistintos(rng)
      if (spec.mode === 'sign') {
        return elegir('¿Qué signo va en el recuadro?', ['>', '<'], a > b ? '>' : '<', `${a}  ❓  ${b}`)
      }
      if (spec.mode === 'statement') {
        const [grande, pequeno] = a > b ? [a, b] : [b, a]
        return elegir(
          '¿Qué comparación es correcta?',
          [`${grande} > ${pequeno}`, `${pequeno} > ${grande}`, `${grande} < ${pequeno}`],
          `${grande} > ${pequeno}`,
        )
      }
      const [x, y, z] = [a, b, c].sort((m, n) => m - n)
      return elegir(
        `Ordena de menor a mayor: ${[a, b, c].slice(0, 2).join(', ')} y ${c}`,
        [`${x}, ${y}, ${z}`, `${z}, ${y}, ${x}`, `${y}, ${x}, ${z}`],
        `${x}, ${y}, ${z}`,
      )
    }

    case 'column':
      return columna(spec.operator, rng)

    case 'word-problem':
      return problema(spec.operator, rng)

    case 'nearest-ten': {
      // Sin acabar en 0 (ya es decena) ni en 5 (a mitad de camino, no hay una más cercana)
      let n = int(rng, 11, 99)
      while (n % 10 === 0 || n % 10 === 5) n = int(rng, 11, 99)
      const bajo = Math.floor(n / 10) * 10
      return elegir(`¿Cuál es la decena más cercana a ${n}?`, [bajo, bajo + 10], Math.round(n / 10) * 10)
    }

    case 'mental': {
      if (spec.mode === 'add-bridge') {
        let a = int(rng, 2, 9)
        let b = int(rng, 2, 9)
        while (a + b < 11) {
          a = int(rng, 2, 9)
          b = int(rng, 2, 9)
        }
        return numero(`${a} + ${b} =`, a + b)
      }
      if (spec.mode === 'sub-bridge') {
        const a = int(rng, 11, 18)
        const b = int(rng, a - 9, 9)
        return numero(`${a} − ${b} =`, a - b)
      }
      if (spec.mode === 'tens-add') {
        const a = int(rng, 1, 9)
        const b = int(rng, 1, 10 - a)
        return numero(`${a * 10} + ${b * 10} =`, (a + b) * 10)
      }
      const a = int(rng, 2, 10)
      const b = int(rng, 1, a - 1)
      return numero(`${a * 10} − ${b * 10} =`, (a - b) * 10)
    }
  }
}
