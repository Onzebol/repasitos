import { generarItinerario, generarProgramacion } from './itinerarios'
import { nombreNumero } from './numberNames'
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

// Los deportes de «la información oculta» (dibujo y nombre) y los nombres de quienes los practican (sin datos de nadie real)
const DEPORTES = [
  { emoji: '🏀', nombre: 'baloncesto' },
  { emoji: '⚽', nombre: 'fútbol' },
  { emoji: '🎾', nombre: 'tenis' },
  { emoji: '🏊', nombre: 'natación' },
  { emoji: '🏐', nombre: 'voleibol' },
  { emoji: '🚴', nombre: 'ciclismo' },
  { emoji: '🏓', nombre: 'tenis de mesa' },
  { emoji: '🏸', nombre: 'bádminton' },
]
const DEPORTISTAS = ['Lucía', 'Pablo', 'Marta', 'Hugo', 'Sara', 'Iván']

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

// Un número de dos cifras y otro de una, sin llevar: 83 + 5 (las unidades suman menos de 10) o 87 − 5 (las unidades alcanzan)
function operandosUnaCifra(operator: '+' | '−', rng: Rng): [number, number] {
  const topTens = int(rng, 1, 9)
  if (operator === '+') {
    const topUnits = int(rng, 0, 8)
    return [topTens * 10 + topUnits, int(rng, 1, 9 - topUnits)]
  }
  const topUnits = int(rng, 1, 9)
  return [topTens * 10 + topUnits, int(rng, 1, topUnits)]
}

const columna = (operator: '+' | '−', carry: boolean, rng: Rng, oneDigit = false): ColumnExercise => {
  const [top, bottom] = oneDigit ? operandosUnaCifra(operator, rng) : carry ? operandosLlevando(operator, rng) : operandos(operator, rng)
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

// Los pasos de un problema: con el texto en la tarjeta de lectura, se elige qué operación hay que hacer o qué se calcula
function pasoDeProblema(ask: 'operation' | 'calculate', rng: Rng): ChoiceExercise {
  const operator = pick(rng, ['+', '−'] as const)
  const [a, b] = operandos(operator, rng)
  const text = pick(rng, operator === '+' ? HISTORIAS_SUMA : HISTORIAS_RESTA)(a, b)
  const ejercicio =
    ask === 'operation'
      ? elegir('¿Hay que sumar o restar?', ['sumar', 'restar'], operator === '+' ? 'sumar' : 'restar')
      : elegir('¿Qué hay que calcular?', ['el total', 'la diferencia'], operator === '+' ? 'el total' : 'la diferencia')
  return { ...ejercicio, text }
}

const sumaSinLlevar = (x: number, y: number) => (x % 10) + (y % 10) < 10 && x + y <= 99
const restaSinLlevar = (x: number, y: number) => x > y && x % 10 >= y % 10

const HISTORIAS_SUMA_RESTA: ((a: number, b: number, c: number) => string)[] = [
  (a, b, c) => `Tengo ${a} cromos y me regalan ${b}. Después regalo ${c}. ¿Cuántos cromos tengo ahora?`,
  (a, b, c) => `En el autobús hay ${a} personas. Suben ${b} y bajan ${c}. ¿Cuántas personas hay ahora?`,
]

const HISTORIAS_RESTA_SUMA: ((a: number, b: number, c: number) => string)[] = [
  (a, b, c) => `Tenía ${a} galletas. Me como ${b} y luego me dan ${c} más. ¿Cuántas galletas tengo ahora?`,
  (a, b, c) => `En la bolsa hay ${a} canicas. Saco ${b} y echo ${c}. ¿Cuántas canicas hay ahora?`,
]

// Dos pasos sin llevar: sumar y restar (a + b − c) o restar y sumar (a − b + c), con resultados entre 1 y 99
function dosPasos(mode: 'add-sub' | 'sub-add', rng: Rng): NumberExercise {
  for (let intento = 0; intento < 1000; intento++) {
    const a = int(rng, 10, 89)
    const b = int(rng, 1, 50)
    const c = int(rng, 1, 50)
    if (mode === 'add-sub' && sumaSinLlevar(a, b) && restaSinLlevar(a + b, c)) {
      return numero(pick(rng, HISTORIAS_SUMA_RESTA)(a, b, c), a + b - c)
    }
    if (mode === 'sub-add' && restaSinLlevar(a, b) && sumaSinLlevar(a - b, c)) {
      return numero(pick(rng, HISTORIAS_RESTA_SUMA)(a, b, c), a - b + c)
    }
  }
  throw new Error('No se ha podido crear un problema de dos pasos')
}

// Comparar con datos de la vida real: pueblos (km), edades y mochilas (kilos). Los datos van en la tarjeta de lectura
type ContextoComparar = { intro: string; nombres: string[]; dato: (nombre: string, n: number) => string; min: number; max: number; mayor: string; menor: string }
const CONTEXTOS_COMPARAR: ContextoComparar[] = [
  {
    intro: 'Distancias',
    nombres: ['Robledal', 'Almendral', 'Pinares', 'Cañada', 'Los Olmos', 'Fuentes'],
    dato: (nombre, n) => `${nombre} ${n} km`,
    min: 10,
    max: 99,
    mayor: '¿Qué pueblo está más lejos?',
    menor: '¿Qué pueblo está más cerca?',
  },
  {
    intro: 'Edades',
    nombres: ['Marta', 'Pablo', 'Lucía', 'Hugo', 'Sara', 'Iván'],
    dato: (nombre, n) => `${nombre} ${n} años`,
    min: 10,
    max: 99,
    mayor: '¿Quién es mayor?',
    menor: '¿Quién es menor?',
  },
  {
    intro: 'Pesos',
    nombres: ['La mochila roja', 'La mochila azul', 'La mochila verde', 'La mochila negra', 'La mochila rosa', 'La mochila naranja'],
    dato: (nombre, n) => `${nombre} ${n} kilos`,
    min: 10,
    max: 30,
    mayor: '¿Qué mochila pesa más?',
    menor: '¿Qué mochila pesa menos?',
  },
]

function compararEnContexto(rng: Rng): ChoiceExercise {
  const contexto = pick(rng, CONTEXTOS_COMPARAR)
  const nombres = shuffle(rng, contexto.nombres).slice(0, 3)
  const valores = tresDistintos(rng, contexto.min, contexto.max)
  const mayor = pick(rng, [true, false])
  const elegido = mayor ? Math.max(...valores) : Math.min(...valores)
  const respuesta = nombres[valores.indexOf(elegido)]
  return {
    ...elegir(mayor ? contexto.mayor : contexto.menor, nombres, respuesta),
    text: `${contexto.intro}: ${nombres.map((nombre, i) => contexto.dato(nombre, valores[i])).join(', ')}.`,
  }
}

// Qué número va en «48 > ❓», «48 < ❓», «❓ > 48» o «❓ < 37»: solo una de las tres opciones hace cierta la comparación
function completarDesigualdad(rng: Rng): ChoiceExercise {
  const a = int(rng, 20, 90)
  const [hueco, signo] = pick(rng, [['derecha', '>'], ['derecha', '<'], ['izquierda', '>'], ['izquierda', '<']] as const)
  // El hueco debe ser mayor que a en «a < ❓» y «❓ > a»; menor en «a > ❓» y «❓ < a»
  const mayor = (hueco === 'derecha') === (signo === '<')
  const cumple = (x: number) => (mayor ? x > a : x < a)
  const correcta = mayor ? int(rng, a + 1, 99) : int(rng, 10, a - 1)
  const equivocadas = new Set<number>()
  while (equivocadas.size < 2) {
    const x = int(rng, 10, 99)
    if (x !== a && !cumple(x)) equivocadas.add(x)
  }
  const visual = hueco === 'derecha' ? `${a}  ${signo}  ❓` : `❓  ${signo}  ${a}`
  return elegir('¿Qué número va en el recuadro?', [correcta, ...equivocadas], correcta, visual)
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
      const min = spec.min ?? 10
      const max = spec.max ?? 99
      // Hacia atrás: se empieza arriba y siempre queda sitio para bajar tres veces sin salirse del rango
      const salto = spec.down ? -spec.step : spec.step
      const inicio = spec.down ? int(rng, min + 3 * spec.step, max) : int(rng, min, max - 3 * spec.step)
      const mostrados = [0, 1, 2].map((i) => inicio + i * salto)
      return numero(`Completa la serie: ${mostrados.join(', ')}, …`, inicio + 3 * salto)
    }

    case 'operation-sign': {
      const operador = pick(rng, ['+', '−'] as const)
      const [a, b] = operandos(operador, rng)
      const resultado = operador === '+' ? a + b : a - b
      return elegir('¿Qué signo va en el recuadro?', ['+', '−'], operador, `${a}  ❓  ${b}  =  ${resultado}`)
    }

    case 'route':
      return generarItinerario(spec.ask, rng)

    case 'route-program':
      return generarProgramacion(rng)

    case 'hidden-info': {
      // Resta sin llevar con un resultado de dos cifras, que es el número de un deporte de la tabla
      let [a, b] = restandos(rng)
      while (a - b < 10) [a, b] = restandos(rng)
      const resultado = a - b
      // Los números de la tabla: el resultado, la suma si cabe en dos cifras (la trampa de sumar en vez de restar) y otros al
      // azar, todos distintos; cada uno con un deporte distinto
      const numeros = [resultado, ...(a + b <= 99 ? [a + b] : [])]
      while (numeros.length < 4) {
        const n = int(rng, 10, 99)
        if (!numeros.includes(n)) numeros.push(n)
      }
      const [respuesta, ...resto] = shuffle(rng, DEPORTES).slice(0, 4).map((d, i) => ({ ...d, numero: numeros[i] }))
      // opciones equivocadas: la trampa (si la hay) y otro de los deportes de la tabla
      const equivocadas = a + b <= 99 ? [resto[0], pick(rng, resto.slice(1))] : shuffle(rng, resto).slice(0, 2)
      const opciones = [respuesta, ...equivocadas]
      const tabla = shuffle(rng, [respuesta, ...resto]).map((d) => `${d.emoji} ${d.nombre} ${d.numero}`)
      return {
        ...elegir(`¿Qué deporte practica ${pick(rng, DEPORTISTAS)}? Resta y averígualo.`, opciones.map((o) => o.emoji), respuesta.emoji, `${a}  −  ${b}  =  ❓`),
        labels: Object.fromEntries(opciones.map((o) => [o.emoji, o.nombre])),
        text: `Cada deporte tiene un número: ${tabla.join(' · ')}.`,
      }
    }

    case 'table-paint': {
      // De 1 a 9: con 0 unidades o 0 decenas saldrían los números de una cifra con un 0 delante, que confunden
      if (spec.ask === 'units') {
        const n = int(rng, 1, 9)
        return { type: 'table-paint', question: `Toca los números que tienen ${unidades(n)}`, targets: Array.from({ length: 10 }, (_, d) => d * 10 + n), answer: `Acaban en ${n}` }
      }
      if (spec.ask === 'tens') {
        const n = int(rng, 1, 9)
        return { type: 'table-paint', question: `Toca los números que tienen ${decenas(n)}`, targets: Array.from({ length: 10 }, (_, u) => n * 10 + u), answer: `Empiezan por ${n}` }
      }
      const [d, u] = [int(rng, 1, 9), int(rng, 1, 9)]
      return { type: 'table-paint', question: `Toca el número que tiene ${decenas(d)} y ${unidades(u)}`, targets: [d * 10 + u], answer: String(d * 10 + u) }
    }

    case 'table-fill': {
      // Fila: la decena de 1 a 9 (la 0 empieza por «0»); columna: la unidad de 0 a 9. Se escriben cinco de los diez números
      // (ordenados); en una columna el de arriba (02) viene siempre dado para no escribir un 0 delante
      const fila = spec.ask === 'row'
      const index = int(rng, fila ? 1 : 0, 9)
      const posibles = Array.from({ length: fila ? 10 : 9 }, (_, i) => i + (fila ? 0 : 1))
      const blanks = shuffle(rng, posibles).slice(0, 5).sort((a, b) => a - b)
      const dos = (n: number) => String(n).padStart(2, '0')
      return {
        type: 'table-fill',
        question: fila ? 'Completa la fila amarilla' : 'Completa la columna naranja',
        line: spec.ask,
        index,
        blanks,
        answer: fila ? `${dos(index * 10)} a ${dos(index * 10 + 9)}` : `${dos(index)} a ${dos(90 + index)}`,
      }
    }

    case 'table-99': {
      if (spec.ask === 'row' || spec.ask === 'column') {
        // Fila: las decenas, de 1 a 9 (la 0 empieza por «0»); columna: las unidades, de 0 a 9
        const fila = spec.ask === 'row'
        const minimo = fila ? 1 : 0
        const cifra = int(rng, minimo, 9)
        const otras = shuffle(rng, Array.from({ length: 10 - minimo }, (_, i) => i + minimo).filter((x) => x !== cifra)).slice(0, 2)
        return {
          ...elegir(
            fila ? 'Todos los números de la fila amarilla empiezan por…' : 'Todos los números de la columna naranja acaban en…',
            [cifra, ...otras],
            cifra,
          ),
          table: fila ? { row: cifra } : { col: cifra },
        }
      }
      // El que falta, con su fila y su columna marcadas. Opciones: el de las cifras cambiadas (47 y 74) y un vecino
      const n = int(rng, 10, 99)
      const [d, u] = [Math.floor(n / 10), n % 10]
      const cambiado = u * 10 + d
      const vecinos = shuffle(rng, [n - 10, n - 1, n + 1, n + 10].filter((m) => m >= 10 && m <= 99))
      const otros = u !== 0 && u !== d ? [cambiado, vecinos[0]] : vecinos.slice(0, 2)
      return { ...elegir('¿Qué número falta?', [n, ...otros], n), table: { row: d, col: u, hole: n } }
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

    case 'number-name': {
      const n = int(rng, 10, 99)
      if (spec.ask === 'write') return numero(`Escribe con cifras: ${nombreNumero(n)}`, n)
      // Los números vecinos y, si las cifras son distintas, el de las cifras cambiadas (86 → 68)
      const cambiado = (n % 10) * 10 + Math.floor(n / 10)
      const cambiadoVale = n % 10 !== 0 && n % 10 !== Math.floor(n / 10)
      const vecinos = shuffle(rng, [n - 10, n - 1, n + 1, n + 10].filter((m) => m >= 10 && m <= 99))
      const otros = cambiadoVale ? [cambiado, vecinos[0]] : vecinos.slice(0, 2)
      return elegir(`¿Cómo se lee el número ${n}?`, [n, ...otros].map(nombreNumero), nombreNumero(n))
    }

    case 'decompose': {
      // Decena y unidad distintas y sin cero: así las opciones nunca se repiten ni suenan raras
      const d = int(rng, 1, 9)
      let u = int(rng, 1, 9)
      while (u === d) u = int(rng, 1, 9)
      const n = d * 10 + u
      if (spec.ask === 'sum') {
        return pick(rng, [true, false])
          ? numero(`Descompón el ${n}: ${n} = ${d * 10} + ❓`, u)
          : numero(`Descompón el ${n}: ${n} = ❓ + ${u}`, d * 10)
      }
      if (spec.ask === 'pieces') {
        return elegir(
          `${decenas(d)} y ${unidades(u)}. ¿Qué suma es?`,
          [`${d * 10} + ${u}`, `${u * 10} + ${d}`, `${d} + ${u}`],
          `${d * 10} + ${u}`,
        )
      }
      const otraUnidad = pick(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== u))
      const otraDecena = pick(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== d))
      const confundido = pick(rng, [d * 10 + otraUnidad, otraDecena * 10 + u])
      return elegir(
        `¿Cómo se lee ${d * 10} + ${u}?`,
        [n, u * 10 + d, confundido].map(nombreNumero),
        nombreNumero(n),
      )
    }

    case 'tens-units': {
      const d = int(rng, 1, 9)
      return spec.ask === 'to-units'
        ? numero(`${decenas(d)} = ❓ unidades`, d * 10)
        : numero(`${unidades(d * 10)} = ❓ decenas`, d)
    }

    case 'digit-clue': {
      const cifra = int(rng, 1, 9)
      const cumple = (m: number) => (spec.ask === 'tens' ? Math.floor(m / 10) : m % 10) === cifra
      const correcta = spec.ask === 'tens' ? cifra * 10 + int(rng, 0, 9) : int(rng, 1, 9) * 10 + cifra
      // Una opción con las cifras cambiadas (37 y 73) y otra al azar, ninguna de las dos cumple la condición
      const equivocadas = new Set<number>()
      const cambiado = (correcta % 10) * 10 + Math.floor(correcta / 10)
      if (cambiado >= 10 && !cumple(cambiado)) equivocadas.add(cambiado)
      while (equivocadas.size < 2) {
        const m = int(rng, 10, 99)
        if (!cumple(m)) equivocadas.add(m)
      }
      return elegir(
        `¿Qué número tiene ${spec.ask === 'tens' ? decenas(cifra) : unidades(cifra)}?`,
        [correcta, ...equivocadas],
        correcta,
      )
    }

    case 'compare': {
      if (spec.mode === 'complete') return completarDesigualdad(rng)
      if (spec.mode === 'context') return compararEnContexto(rng)
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
      return columna(spec.operator, spec.carry ?? false, rng, spec.oneDigit ?? false)

    case 'problem-step':
      return pasoDeProblema(spec.ask, rng)

    case 'two-steps':
      return dosPasos(spec.mode, rng)

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
      const sinMitad = (min: number) => {
        let n = int(rng, min, 99)
        while (n % 10 === 0 || n % 10 === 5) n = int(rng, min, 99)
        return n
      }
      if (spec.ask === 'between') {
        // Aquí vale cualquier número de dos cifras que no sea una decena (también los acabados en 5)
        let n = int(rng, 11, 99)
        while (n % 10 === 0) n = int(rng, 11, 99)
        const bajo = Math.floor(n / 10) * 10
        const par = (x: number) => `${x} y ${x + 10}`
        const equivocadas = [par(bajo - 10), ...(bajo <= 80 ? [par(bajo + 10)] : []), ...(bajo >= 20 ? [par(bajo - 20)] : [])]
        return elegir(`¿Entre qué dos decenas está el ${n}?`, [par(bajo), ...dosAlAzar(rng, equivocadas, par(bajo), 'entre qué decenas')], par(bajo))
      }
      if (spec.ask === 'rule') {
        const n = sinMitad(11)
        return elegir(`¿La cifra de las unidades del ${n} es mayor o menor que 5?`, ['mayor que 5', 'menor que 5'], n % 10 > 5 ? 'mayor que 5' : 'menor que 5')
      }
      if (spec.ask === 'approx') {
        const n = sinMitad(11)
        const bajo = Math.floor(n / 10) * 10
        const cercana = Math.round(n / 10) * 10
        const otra = cercana === bajo ? bajo + 10 : bajo
        const historia = pick(rng, [
          `Un abuelo tiene ${n} años. Más o menos, ¿cuántos años tiene?`,
          `Un libro tiene ${n} páginas. Más o menos, ¿cuántas páginas tiene?`,
          `Un camino mide ${n} kilómetros. Más o menos, ¿cuántos kilómetros mide?`,
          `En el cine hay ${n} personas. Más o menos, ¿cuántas hay?`,
        ])
        // La tercera opción, otra decena más lejos, entre 10 y 100
        const lejana = pick(rng, [...(bajo >= 20 ? [bajo - 10] : []), ...(bajo <= 80 ? [bajo + 20] : [])])
        return elegir(historia, [cercana, otra, lejana], cercana)
      }
      // Con el 6, 7, 8 y 9 la decena de arriba es el 10 (y la otra opción, el 20)
      const n = sinMitad(6)
      const bajo = Math.floor(n / 10) * 10
      const opciones = n < 10 ? [10, 20] : [bajo, bajo + 10]
      return elegir(`¿Cuál es la decena más cercana a ${n}?`, opciones, Math.round(n / 10) * 10)
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
      if (spec.mode === 'add-small') {
        // Sin pasar de 10: 3 + 4, 6 + 2
        const a = int(rng, 1, 8)
        const b = int(rng, 1, 10 - a)
        return numero(`${a} + ${b} =`, a + b)
      }
      if (spec.mode === 'sub-small') {
        // Restas de números hasta el 10: 4 − 2, 9 − 5
        const a = int(rng, 2, 10)
        const b = int(rng, 1, a - 1)
        return numero(`${a} − ${b} =`, a - b)
      }
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
