import { int, pick, shuffle } from './random'
import type { Rng } from './random'
import { ANIMALES as ANIMALES_CON_NOMBRE } from './infantil/animales'
import type { Animal } from './infantil/animales'
import { RIMAS, SONIDOS } from './infantil/letras/palabras'
import type { Palabra } from './infantil/letras/palabras'
import type { Digit } from './infantil/trazos'
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

const ORDINALES = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo']

// Un solo carácter cada uno (sin variantes), para poder dibujar una fila de 10 y contarlos
const ANIMALES = ['🐘', '🐢', '🐰', '🐸', '🐱', '🐶', '🐟', '🐧', '🐮', '🐷', '🦁', '🐵', '🐻', '🦊']

// «de el» → «del» y «a el» → «al» (las tablas guardan cada elemento con su artículo)
export const contrae = (texto: string): string => texto.replace(/\bde el\b/g, 'del').replace(/\ba el\b/g, 'al')

// Primera letra en mayúscula, también tras la apertura de interrogación
export const capitaliza = (texto: string): string => texto.replace(/^(¿?)(\p{L})/u, (_, signo: string, letra: string) => signo + letra.toUpperCase())

const frase = (texto: string): string => capitaliza(contrae(texto))

// Dos opciones equivocadas al azar de una lista (distintas entre sí y de la respuesta); avisa si no hay suficientes
function dosAlAzar(rng: Rng, candidatas: string[], respuesta: string, de: string): string[] {
  const distintas = [...new Set(candidatas)].filter((c) => c !== respuesta)
  if (distintas.length < 2) throw new Error(`Hacen falta al menos dos opciones equivocadas para: ${de}`)
  return shuffle(rng, distintas).slice(0, 2)
}

const conDibujo = (m: { label: string; emoji?: string }) => (m.emoji ? `${m.emoji} ${m.label}` : m.label)

// Tres cifras distintas entre min y max, con la respuesta entre ellas (las opciones se barajan al montar la sesión)
function tresCifras(rng: Rng, answer: number, min: number, max: number): number[] {
  if (max - min < 2) throw new Error('Hacen falta al menos tres cifras distintas en el rango')
  const otras = new Set<number>()
  while (otras.size < 2) {
    const n = int(rng, min, max)
    if (n !== answer) otras.add(n)
  }
  return [answer, ...otras]
}

// «3 perros», «1 perro»: nombre accesible de un grupo de dibujos
const etiqueta = (animal: Animal, k: number) => `${k} ${k === 1 ? animal.singular : animal.plural}`

const decenas = (n: number) => `${n} ${n === 1 ? 'decena' : 'decenas'}`
const unidades = (n: number) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`

const piezas = (d: number, u: number) => `${'🟦'.repeat(d)}  ${'🟨'.repeat(u)}`

const centenas = (n: number) => `${n} ${n === 1 ? 'centena' : 'centenas'}`
const centenasDecenasUnidades = (c: number, d: number, u: number) => `${centenas(c)}, ${decenas(d)} y ${unidades(u)}`

// De menor a mayor capacidad (el litro: una garrafa de agua tiene unos 5 litros, un vaso mucho menos de uno)
const RECIPIENTES = ['una cucharilla', 'un vaso', 'una jarra de agua', 'una garrafa de agua', 'una bañera', 'una piscina']

// Tres números distintos de dos cifras
function tresDistintos(rng: Rng, min = 10, max = 99): [number, number, number] {
  const numeros = new Set<number>()
  while (numeros.size < 3) numeros.add(int(rng, min, max))
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

// Minuendo y sustraendo de dos cifras que se restan llevando: las unidades del minuendo son menores (se pide una
// decena) y las decenas que quedan aún alcanzan para restar las del sustraendo, así que el resultado es positivo
function restandosLlevando(rng: Rng): [number, number] {
  const topUnits = int(rng, 0, 8)
  const bottomUnits = int(rng, topUnits + 1, 9)
  const topTens = int(rng, 2, 9)
  const bottomTens = int(rng, 1, topTens - 1)
  return [topTens * 10 + topUnits, bottomTens * 10 + bottomUnits]
}

const operandos = (operator: '+' | '−', rng: Rng) => (operator === '+' ? sumandos(rng) : restandos(rng))

// Dos números de dos cifras cuyas unidades suman 10 o más (se lleva una decena)
function sumandosLlevando(rng: Rng): [number, number] {
  const topUnits = int(rng, 1, 9)
  const bottomUnits = int(rng, 10 - topUnits, 9)
  return [int(rng, 1, 9) * 10 + topUnits, int(rng, 1, 9) * 10 + bottomUnits]
}

const operandosLlevando = (operator: '+' | '−', rng: Rng) => (operator === '+' ? sumandosLlevando(rng) : restandosLlevando(rng))

const columna = (operator: '+' | '−', carry: boolean, rng: Rng): ColumnExercise => {
  const [top, bottom] = carry ? operandosLlevando(operator, rng) : operandos(operator, rng)
  return {
    type: 'column',
    question: operator === '+' ? 'Suma en columna' : 'Resta en columna',
    operator,
    top,
    bottom,
    answer: operator === '+' ? top + bottom : top - bottom,
    ...(carry && { carry }),
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

const problema = (operator: '+' | '−', carry: boolean, rng: Rng): NumberExercise => {
  const [a, b] = carry ? operandosLlevando(operator, rng) : operandos(operator, rng)
  const historia = pick(rng, operator === '+' ? HISTORIAS_SUMA : HISTORIAS_RESTA)
  return numero(historia(a, b), operator === '+' ? a + b : a - b)
}

// Elegir entre dibujos de palabras: las opciones son los emojis y cada uno lleva su palabra como nombre accesible
const conPalabras = (question: string, modelo: Palabra, opciones: Palabra[], respuesta: Palabra): ChoiceExercise => ({
  ...elegir(question, opciones.map((o) => o.emoji), respuesta.emoji, modelo.emoji),
  labels: Object.fromEntries(opciones.map((o) => [o.emoji, o.palabra])),
})

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
      const opciones = tresDistintos(rng, spec.min, spec.max)
      const mayor = spec.mode === 'greatest'
      return elegir(
        mayor ? '¿Cuál es el número mayor?' : '¿Cuál es el número menor?',
        opciones,
        mayor ? Math.max(...opciones) : Math.min(...opciones),
      )
    }

    case 'series': {
      const inicio = int(rng, spec.min ?? 10, (spec.max ?? 99) - 3 * spec.step)
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
      const [a, b, c] = tresDistintos(rng, spec.min, spec.max)
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
      return columna(spec.operator, spec.carry ?? false, rng)

    case 'word-problem':
      return problema(spec.operator, spec.carry ?? false, rng)

    case 'cdu': {
      if (spec.ask === 'compose') {
        const c = int(rng, 1, 9)
        const d = int(rng, 0, 9)
        const u = int(rng, 0, 9)
        return numero(`${centenasDecenasUnidades(c, d, u)}. ¿Qué número es?`, c * 100 + d * 10 + u)
      }
      if (spec.ask === 'blocks') {
        const c = int(rng, 1, 3)
        const d = int(rng, 1, 9)
        const u = int(rng, 1, 9)
        return numero(
          '🟥 es una centena, 🟦 una decena y 🟨 una unidad. ¿Qué número es?',
          c * 100 + d * 10 + u,
          `${'🟥'.repeat(c)}  ${'🟦'.repeat(d)}  ${'🟨'.repeat(u)}`,
        )
      }
      if (spec.ask === 'count') {
        const n = int(rng, 100, 999)
        const [lugar, cifra] = pick(rng, [
          ['centenas', Math.floor(n / 100)],
          ['decenas', Math.floor((n % 100) / 10)],
          ['unidades', n % 10],
        ] as const)
        return numero(`¿Cuántas ${lugar} tiene el ${n}?`, cifra)
      }
      // Centenas, decenas y unidades distintas y sin cero: así las opciones nunca se repiten ni suenan raras
      const c = int(rng, 1, 9)
      let d = int(rng, 1, 9)
      while (d === c) d = int(rng, 1, 9)
      let u = int(rng, 1, 9)
      while (u === c || u === d) u = int(rng, 1, 9)
      return elegir(
        `El número ${c * 100 + d * 10 + u} tiene…`,
        [centenasDecenasUnidades(c, d, u), centenasDecenasUnidades(c, u, d), centenasDecenasUnidades(d, c, u)],
        centenasDecenasUnidades(c, d, u),
      )
    }

    case 'capacity': {
      const lugares = shuffle(rng, RECIPIENTES.map((_, i) => i)).slice(0, 3)
      const buscado = spec.mode === 'more' ? Math.max(...lugares) : Math.min(...lugares)
      const ejercicio = elegir(
        spec.mode === 'more' ? '¿Cuál tiene más capacidad?' : '¿Cuál tiene menos capacidad?',
        lugares.map((i) => RECIPIENTES[i]),
        RECIPIENTES[buscado],
      )
      return { ...ejercicio, fact: `capacity:${spec.mode}:${[...lugares].sort().join('')}` }
    }

    case 'nearest-ten': {
      // Sin acabar en 0 (ya es decena) ni en 5 (a mitad de camino, no hay una más cercana)
      let n = int(rng, 11, 99)
      while (n % 10 === 0 || n % 10 === 5) n = int(rng, 11, 99)
      const bajo = Math.floor(n / 10) * 10
      return elegir(`¿Cuál es la decena más cercana a ${n}?`, [bajo, bajo + 10], Math.round(n / 10) * 10)
    }

    case 'how-many': {
      const min = spec.min ?? 1
      const max = spec.max ?? 7
      const n = int(rng, min, max)
      const animal = pick(rng, ANIMALES_CON_NOMBRE)
      const ejercicio = elegir(`¿Cuánt${animal.fem ? 'as' : 'os'} ${animal.plural} hay?`, tresCifras(rng, n, min, max), n, animal.emoji.repeat(n))
      return spec.tap ? { ...ejercicio, tapToCount: true } : ejercicio
    }

    case 'classify': {
      const miembro = pick(rng, spec.items)
      const grupo = spec.groups.find((g) => g.id === miembro.group)
      if (!grupo) throw new Error(`Sin categoría para ${miembro.label}`)
      const otras = spec.groups.filter((g) => g.id !== grupo.id).map((g) => g.label)
      const opciones = [grupo.label, ...dosAlAzar(rng, otras, grupo.label, miembro.label)]
      const ejercicio = elegir(frase(spec.question.replace('{item}', miembro.label)), opciones, grupo.label, miembro.emoji)
      return { ...ejercicio, fact: `member:${miembro.group}:${miembro.label}` }
    }

    case 'pick-member': {
      const elementos = spec.items.filter((m) => !m.plural)
      const miembro = pick(rng, elementos)
      const grupo = spec.groups.find((g) => g.id === miembro.group)
      if (!grupo) throw new Error(`Sin categoría para ${miembro.label}`)
      if (!grupo.question) throw new Error(`La categoría ${grupo.id} no tiene pregunta`)
      const respuesta = conDibujo(miembro)
      const otras = elementos.filter((m) => m.group !== grupo.id).map(conDibujo)
      const ejercicio = elegir(frase(grupo.question), [respuesta, ...dosAlAzar(rng, otras, respuesta, miembro.label)], respuesta)
      return { ...ejercicio, fact: `member:${miembro.group}:${miembro.label}` }
    }

    case 'sequence': {
      const { steps } = spec
      type Hecho = { modo: 'first' | 'last' | 'after' | 'before'; i: number }
      const hechos: Hecho[] = []
      if (spec.first) hechos.push({ modo: 'first', i: 0 })
      if (spec.last) hechos.push({ modo: 'last', i: steps.length - 1 })
      for (let i = 0; i < steps.length - 1; i++) if (spec.after) hechos.push({ modo: 'after', i })
      for (let i = 1; i < steps.length; i++) if (spec.before) hechos.push({ modo: 'before', i })
      const hecho = pick(rng, hechos)
      const respuesta = hecho.modo === 'after' ? steps[hecho.i + 1] : hecho.modo === 'before' ? steps[hecho.i - 1] : steps[hecho.i]
      const plantilla = { first: spec.first, last: spec.last, after: spec.after, before: spec.before }[hecho.modo]!
      const pregunta = frase(plantilla.replace('{step}', steps[hecho.i]))
      const referido = steps[hecho.i]
      const candidatas = [...steps, ...(spec.extra ?? [])].filter((p) => p !== respuesta && p !== referido)
      const ejercicio = elegir(pregunta, [respuesta, ...dosAlAzar(rng, candidatas, respuesta, pregunta)], respuesta)
      return { ...ejercicio, fact: `seq:${spec.id}:${hecho.modo}:${hecho.i}` }
    }

    case 'pairs': {
      const i = int(rng, 0, spec.rows.length - 1)
      const fila = spec.rows[i]
      const adelante = rng() < 0.5
      const respuesta = adelante ? fila.answer : fila.answerBack
      const otras = spec.rows.filter((_, j) => j !== i).map((f) => (adelante ? f.answer : f.answerBack))
      const ejercicio = elegir(adelante ? fila.ask : fila.askBack, [respuesta, ...dosAlAzar(rng, otras, respuesta, fila.ask)], respuesta, fila.emoji)
      // La identidad es la pregunta de ida (no la posición): dos tablas de pares en un mismo tema no se pisan
      return { ...ejercicio, fact: `pair:${fila.ask}` }
    }

    case 'facts': {
      const item = pick(rng, spec.items)
      const ejercicio = elegir(item.question, [item.answer, ...dosAlAzar(rng, item.wrong, item.answer, item.question)], item.answer, item.visual)
      return { ...ejercicio, ...(item.text ? { text: item.text } : {}), fact: `fact:${item.question}` }
    }

    case 'group': {
      const min = spec.min ?? 1
      const max = spec.max ?? 7
      const n = int(rng, min, max)
      const animal = pick(rng, ANIMALES_CON_NOMBRE)
      const cantidades = tresCifras(rng, n, min, max) // la primera es la respuesta
      const grupos = cantidades.map((k) => animal.emoji.repeat(k))
      const labels = Object.fromEntries(cantidades.map((k, i) => [grupos[i], etiqueta(animal, k)]))
      return { ...elegir(`¿Dónde hay ${n}?`, grupos, grupos[0], String(n)), labels }
    }

    case 'next-number': {
      const min = spec.min ?? 1
      const max = spec.max ?? 9
      if (spec.mode === 'after') {
        const n = int(rng, min, max - 1)
        return elegir(`¿Qué número va después del ${n}?`, tresCifras(rng, n + 1, min, max), n + 1)
      }
      if (spec.mode === 'before') {
        const n = int(rng, min + 1, max)
        return elegir(`¿Qué número va antes del ${n}?`, tresCifras(rng, n - 1, min, max), n - 1)
      }
      const n = int(rng, min, max - 2)
      return elegir('¿Qué número falta?', tresCifras(rng, n + 1, min, max), n + 1, `${n}  ?  ${n + 2}`)
    }

    case 'more-less': {
      const min = spec.min ?? 1
      const max = spec.max ?? 7
      const animal = pick(rng, ANIMALES_CON_NOMBRE)
      const a = int(rng, min, max)
      let b = int(rng, min, max)
      while (b === a) b = int(rng, min, max)
      const grupos = [a, b].map((k) => animal.emoji.repeat(k))
      const respuesta = spec.mode === 'more' ? Math.max(a, b) : Math.min(a, b)
      const labels = Object.fromEntries([a, b].map((k, i) => [grupos[i], etiqueta(animal, k)]))
      return {
        ...elegir(spec.mode === 'more' ? '¿Dónde hay más?' : '¿Dónde hay menos?', grupos, animal.emoji.repeat(respuesta)),
        labels,
      }
    }

    case 'digit': {
      const min = spec.min ?? 1
      const max = spec.max ?? 9
      const n = int(rng, min, max)
      return elegir(`Toca el número ${n}`, tresCifras(rng, n, min, max), n)
    }

    case 'trace': {
      const digit = int(rng, spec.min ?? 0, spec.max ?? 9) as Digit
      return { type: 'trace', question: `Repasa el número ${digit}`, digit, answer: digit }
    }

    case 'rhyme': {
      const familia = pick(rng, RIMAS)
      const [modelo, respuesta] = shuffle(rng, familia.palabras)
      // Equivocadas: dibujos de otras familias, de dos familias distintas
      const otras = shuffle(rng, RIMAS.filter((r) => r !== familia)).slice(0, 2).map((r) => pick(rng, r.palabras))
      return conPalabras(`¿Qué rima con ${modelo.palabra}?`, modelo, [respuesta, ...otras], respuesta)
    }

    case 'initial-sound': {
      const modelo = pick(rng, SONIDOS)
      const respuesta = pick(rng, SONIDOS.filter((p) => p.sonido === modelo.sonido && p !== modelo))
      // Equivocadas: dos sonidos distintos entre sí y del de la respuesta (así ninguna opción es dudosa)
      const sonidos = shuffle(rng, [...new Set(SONIDOS.map((p) => p.sonido))].filter((s) => s !== modelo.sonido)).slice(0, 2)
      const otras = sonidos.map((s) => pick(rng, SONIDOS.filter((p) => p.sonido === s && p.emoji !== modelo.emoji && p.emoji !== respuesta.emoji)))
      return conPalabras(`¿Cuál empieza igual que ${modelo.palabra}?`, modelo, [respuesta, ...otras], respuesta)
    }

    case 'ordinal': {
      const lugar = int(rng, 0, 9)
      if (spec.mode === 'position') {
        const fila = shuffle(rng, ANIMALES).slice(0, 10)
        const otros = shuffle(rng, fila.filter((_, i) => i !== lugar)).slice(0, 2)
        return elegir(`Desde la izquierda, ¿cuál es el ${ORDINALES[lugar]}?`, [fila[lugar], ...otros], fila[lugar], fila.join(''))
      }
      const cerca = shuffle(rng, [lugar - 1, lugar + 1, lugar - 2, lugar + 2].filter((n) => n >= 0 && n <= 9)).slice(0, 2)
      return elegir(`¿Cómo se escribe "${ORDINALES[lugar]}"?`, [lugar, ...cerca].map((n) => `${n + 1}.º`), `${lugar + 1}.º`)
    }

    case 'inverse': {
      // a + b = c, con a mayor que b y c menor que 100
      const a = int(rng, 20, 89)
      const b = int(rng, 10, Math.min(a - 1, 99 - a))
      const c = a + b
      if (spec.mode === 'subtract') return numero(`${a} + ${b} = ${c}. Entonces, ${c} − ${b} =`, a)
      if (spec.mode === 'missing') return numero(`Completa: ${a} + ▢ = ${c}`, b)
      return elegir(`¿Qué resta comprueba que ${a} + ${b} = ${c}?`, [`${c} − ${b}`, `${a} − ${b}`, `${c} + ${b}`], `${c} − ${b}`)
    }

    case 'hundreds': {
      const frase = (d: number, u: number) => `1 centena, ${decenas(d)} y ${unidades(u)}`
      if (spec.ask === 'compose') {
        const d = int(rng, 0, 9)
        const u = int(rng, 0, 9)
        return numero(`${frase(d, u)}. ¿Qué número es?`, 100 + d * 10 + u)
      }
      // Decenas y unidades distintas y sin cero, como en place-value
      const d = int(rng, 1, 9)
      let u = int(rng, 1, 9)
      while (u === d) u = int(rng, 1, 9)
      return elegir(`El número ${100 + d * 10 + u} tiene…`, [frase(d, u), frase(u, d), frase(d, d)], frase(d, u))
    }

    case 'mental': {
      if (spec.mode === 'add-three') {
        let a: number, b: number, c: number
        do {
          a = int(rng, 1, 9)
          b = int(rng, 1, 9)
          c = int(rng, 1, 9)
        } while (a + b + c < 10 || a + b + c > 25)
        return numero(`${a} + ${b} + ${c} =`, a + b + c)
      }
      if (spec.mode === 'add-digit') {
        // Sin llevar: las unidades del número más el dígito no pasan de 9
        const decenasN = int(rng, 1, 8)
        const unidadesN = int(rng, 0, 8)
        const digito = int(rng, 1, 9 - unidadesN)
        return numero(`${decenasN * 10 + unidadesN} + ${digito} =`, decenasN * 10 + unidadesN + digito)
      }
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
