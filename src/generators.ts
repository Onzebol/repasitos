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
const ORDINALES_FEMENINOS = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta', 'séptima', 'octava', 'novena', 'décima']
// Delante de un sustantivo masculino, «primero» y «tercero» pierden la -o: el primer dibujo, el tercer dibujo
const ORDINALES_ANTE_SUSTANTIVO = ORDINALES.map((o) => (o === 'primero' ? 'primer' : o === 'tercero' ? 'tercer' : o))

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

// Las figuras de «figuras con valores» (dibujo y cómo se nombran para lectores de pantalla)
const FIGURAS = [
  { emoji: '🟩', nombre: 'cuadrado verde' },
  { emoji: '🔺', nombre: 'triángulo rojo' },
  { emoji: '🔵', nombre: 'círculo azul' },
  { emoji: '🟡', nombre: 'círculo amarillo' },
]

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

// Un número de dos cifras y otro de una: 83 + 5 (las unidades suman menos de 10) o 87 − 5 (las unidades alcanzan).
// Con `carry` (solo sumas) las unidades suman 10 o más: 87 + 9
function operandosUnaCifra(operator: '+' | '−', rng: Rng, carry = false): [number, number] {
  const topTens = int(rng, 1, 9)
  if (operator === '+') {
    if (carry) {
      const topUnits = int(rng, 1, 9)
      return [topTens * 10 + topUnits, int(rng, 10 - topUnits, 9)]
    }
    const topUnits = int(rng, 0, 8)
    return [topTens * 10 + topUnits, int(rng, 1, 9 - topUnits)]
  }
  const topUnits = int(rng, 1, 9)
  return [topTens * 10 + topUnits, int(rng, 1, topUnits)]
}

// Tres sumandos de una o dos cifras (decenas de 0 a 3) cuyas unidades suman 10 o más, así que se lleva una decena o dos,
// y que no pasan de 99: 15 + 14 + 7, 23 + 9 + 11
function tresSumandos(rng: Rng): [number, number, number] {
  for (;;) {
    const [a, b, c] = [0, 1, 2].map(() => int(rng, 0, 3) * 10 + int(rng, 1, 9))
    if ((a % 10) + (b % 10) + (c % 10) >= 10 && a + b + c <= 99) return [a, b, c]
  }
}

const columna = (operator: '+' | '−', carry: boolean, rng: Rng, oneDigit = false, addends: 2 | 3 = 2): ColumnExercise => {
  if (addends === 3) {
    const [top, bottom, third] = tresSumandos(rng)
    return { type: 'column', question: 'Suma en columna', operator: '+', top, bottom, third, answer: top + bottom + third, carry: true }
  }
  const [top, bottom] = oneDigit ? operandosUnaCifra(operator, rng, carry) : carry ? operandosLlevando(operator, rng) : operandos(operator, rng)
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

// La lista de llegada de nueve animales (en la tarjeta de lectura) y una de tres preguntas: quién llegó en un puesto, en qué
// puesto llegó un animal o cuántos llegaron después de uno (el total menos el puesto, del 1º al 8º)
function clasificacion(rng: Rng): ChoiceExercise {
  const fila = shuffle(rng, ANIMALES).slice(0, 9)
  const text = `Llegada: ${fila.map((animal, i) => `${i + 1}º ${animal}`).join(' · ')}`
  const tipo = int(rng, 0, 2)
  if (tipo === 0) {
    const lugar = int(rng, 0, 8)
    const otros = shuffle(rng, fila.filter((_, i) => i !== lugar)).slice(0, 2)
    return { ...elegir(`¿Quién llegó el ${lugar + 1}º?`, [fila[lugar], ...otros], fila[lugar]), text }
  }
  const lugar = int(rng, 1, tipo === 1 ? 9 : 8)
  const animal = fila[lugar - 1]
  if (tipo === 1) {
    // Los puestos de al lado
    const cerca = shuffle(rng, [lugar - 1, lugar + 1, lugar - 2, lugar + 2].filter((n) => n >= 1 && n <= 9)).slice(0, 2)
    return { ...elegir(`¿En qué puesto llegó el ${animal}?`, [lugar, ...cerca].map((n) => `${n}º`), `${lugar}º`), text }
  }
  // Después = 9 − puesto. La trampa: contestar con el propio puesto
  const despues = 9 - lugar
  const falsas = [lugar, despues + 1, despues - 1, lugar - 1, lugar + 1].filter((n, i, todas) => n >= 1 && n !== despues && todas.indexOf(n) === i).slice(0, 2)
  return { ...elegir(`Si el ${animal} llegó el ${lugar}º, ¿cuántos llegaron después?`, shuffle(rng, [despues, ...falsas]), despues), text }
}

// Los pisos de un edificio: «¿Qué piso está dos pisos por debajo del 7º?» (un o dos pisos, por encima o por debajo, del 1º al
// 10º). Las opciones equivocadas son el lado contrario y la otra distancia
function pisos(rng: Rng): ChoiceExercise {
  for (;;) {
    const base = int(rng, 1, 10)
    const distancia = pick(rng, [1, 2])
    const arriba = pick(rng, [true, false])
    const piso = (n: number, d: number, sube: boolean) => (sube ? n + d : n - d)
    const respuesta = piso(base, distancia, arriba)
    if (respuesta < 1 || respuesta > 10) continue
    const candidatas = [piso(base, distancia, !arriba), piso(base, distancia === 1 ? 2 : 1, arriba), base, respuesta - 1, respuesta + 1]
    const falsas = candidatas.filter((n, i, todas) => n >= 1 && n <= 10 && n !== respuesta && todas.indexOf(n) === i).slice(0, 2)
    if (falsas.length < 2) continue
    const pregunta = `¿Qué piso está ${distancia === 1 ? 'un piso' : 'dos pisos'} por ${arriba ? 'encima' : 'debajo'} del ${base}º?`
    return elegir(pregunta, shuffle(rng, [respuesta, ...falsas]).map((n) => `${n}º`), `${respuesta}º`)
  }
}

const TERMINOS_RESTA = ['minuendo', 'sustraendo', 'diferencia']

// Una resta de dos cifras con los tres números distintos (a − b = c, con b y c de dos cifras como mínimo)
function restaDeTresNumeros(rng: Rng): [number, number, number] {
  for (;;) {
    const a = int(rng, 30, 99)
    const b = int(rng, 10, a - 10)
    if (b !== a - b) return [a, b, a - b]
  }
}

// En «38 − 13 = 25», ¿cuál es el sustraendo? (se elige un número) o ¿cómo se llama el 13? (se elige el término)
function terminosDeLaResta(rng: Rng): ChoiceExercise {
  const numeros = restaDeTresNumeros(rng)
  const lugar = int(rng, 0, 2)
  const resta = `En ${numeros[0]} − ${numeros[1]} = ${numeros[2]}`
  if (pick(rng, [true, false])) return elegir(`${resta}, ¿cuál es el ${TERMINOS_RESTA[lugar]}?`, numeros, numeros[lugar])
  return elegir(`${resta}, ¿cómo se llama el ${numeros[lugar]}?`, TERMINOS_RESTA, TERMINOS_RESTA[lugar])
}

// ¿Está bien hecha la resta? A veces el resultado está cambiado (una decena o una unidad de más o de menos, o se ha sumado en
// vez de restar); nunca coincide con el bueno
function restaBienHecha(rng: Rng): ChoiceExercise {
  const [a, b, c] = restaDeTresNumeros(rng)
  const bien = pick(rng, [true, false])
  const mal = pick(rng, [c + 10, c - 10, c + 1, c - 1, a + b].filter((n) => n >= 1 && n <= 99 && n !== c))
  return elegir('¿Está bien hecha la resta?', ['Sí', 'No'], bien ? 'Sí' : 'No', `${a} − ${b} = ${bien ? c : mal}`)
}

// ¿Qué suma es llevando? Tres sumas de dos números de dos cifras: una lleva (las unidades suman 10 o más) y las otras dos no.
// Ninguna pasa de 99, para que el tamaño del resultado no delate cuál es
function sumaQueLleva(rng: Rng): ChoiceExercise {
  const escrita = ([a, b]: [number, number]) => `${a} + ${b}`
  let llevando = sumandosLlevando(rng)
  while (llevando[0] + llevando[1] > 99) llevando = sumandosLlevando(rng)
  const respuesta = escrita(llevando)
  const otras = new Set<string>()
  while (otras.size < 2) otras.add(escrita(sumandos(rng)))
  return elegir('¿Qué suma es llevando?', shuffle(rng, [respuesta, ...otras]), respuesta)
}

const HISTORIAS_SUMA: ((a: number, b: number) => string)[] = [
  (a, b) => `Tengo ${a} pegatinas y me regalan ${b}. ¿Cuántas tengo ahora?`,
  (a, b) => `En el parque hay ${a} niños y llegan ${b} más. ¿Cuántos hay ahora?`,
  (a, b) => `Una caja tiene ${a} lápices y otra tiene ${b}. ¿Cuántos lápices hay en total?`,
  (a, b) => `Leo ${a} páginas por la mañana y ${b} por la tarde. ¿Cuántas páginas leo?`,
  (a, b) => `El mes pasado ahorré ${a} euros y este mes ${b}. ¿Cuántos euros tengo en total?`,
  (a, b) => `El lunes recogí ${a} piñas y el martes ${b}. ¿Cuántas piñas tengo en total?`,
]

// Restas de quitar: lo que queda
const HISTORIAS_RESTA: ((a: number, b: number) => string)[] = [
  (a, b) => `En la bolsa hay ${a} canicas. Saco ${b}. ¿Cuántas quedan?`,
  (a, b) => `Tenía ${a} galletas y me como ${b}. ¿Cuántas me quedan?`,
  (a, b) => `En el autobús van ${a} personas y se bajan ${b}. ¿Cuántas siguen dentro?`,
  (a, b) => `Hay ${a} globos y se pinchan ${b}. ¿Cuántos globos quedan?`,
]

// Restas de completar: hace falta un total, ya hay una parte y se pregunta cuántos faltan (el error típico es sumar).
// Siempre el total primero y lo que ya hay después
const HISTORIAS_FALTAN: ((a: number, b: number) => string)[] = [
  (a, b) => `Para llenar el álbum hacen falta ${a} cromos y ya tengo ${b}. ¿Cuántos cromos me faltan?`,
  (a, b) => `En la excursión van ${a} niños y ya han subido ${b} al autobús. ¿Cuántos faltan por subir?`,
  (a, b) => `Para completar el puzle hacen falta ${a} piezas y ya he puesto ${b}. ¿Cuántas piezas me faltan?`,
  (a, b) => `La biblioteca quiere tener ${a} libros y ya tiene ${b}. ¿Cuántos libros le faltan?`,
  (a, b) => `Para la fiesta hacen falta ${a} globos y ya hay ${b} hinchados. ¿Cuántos faltan por hinchar?`,
]

// Con `faltan` solo salen las restas de completar (nunca sumas)
const historiasDe = (operator: '+' | '−', faltan: boolean) => (operator === '+' ? HISTORIAS_SUMA : faltan ? HISTORIAS_FALTAN : HISTORIAS_RESTA)

const problema = (operator: '+' | '−', carry: boolean, rng: Rng, faltan = false): NumberExercise => {
  const [a, b] = carry ? operandosLlevando(operator, rng) : operandos(operator, rng)
  const historia = pick(rng, historiasDe(operator, faltan))
  return numero(historia(a, b), operator === '+' ? a + b : a - b)
}

// Los dos sumandos de a + b = c. Por defecto a mayor que b y c menor que 100; con `small`, números pequeños (c hasta 20,
// como 7 + 4 = 11); con `round`, decenas redondas (c hasta 90, como 40 + 30 = 70). `round` manda sobre `small`
function terminosInversos(rng: Rng, small = false, round = false): [number, number] {
  if (round) {
    const a = int(rng, 1, 8)
    return [a * 10, int(rng, 1, 9 - a) * 10]
  }
  if (small) {
    const a = int(rng, 3, 15)
    return [a, int(rng, 2, 20 - a)]
  }
  const a = int(rng, 20, 89)
  return [a, int(rng, 10, Math.min(a - 1, 99 - a))]
}

// La suma y la resta se relacionan: de a + b = c salen c − b (`subtract`), c − a o c − b (`both`), el sumando que falta
// (`missing`), el minuendo que falta en ▢ − b = a (`missing-minuend`) y qué resta comprueba la suma (`operation`)
function inversa(mode: 'subtract' | 'both' | 'missing' | 'missing-minuend' | 'operation', a: number, b: number, rng: Rng): Exercise {
  const c = a + b
  if (mode === 'subtract') return numero(`${a} + ${b} = ${c}. Entonces, ${c} − ${b} =`, a)
  if (mode === 'both') {
    const [quitado, queda] = pick(rng, [[b, a], [a, b]])
    return numero(`${a} + ${b} = ${c}. Entonces, ${c} − ${quitado} =`, queda)
  }
  if (mode === 'missing') return numero(`Completa: ${a} + ▢ = ${c}`, b)
  if (mode === 'missing-minuend') return numero(`Completa: ▢ − ${b} = ${a}`, c)
  return elegir(`¿Qué resta comprueba que ${a} + ${b} = ${c}?`, [`${c} − ${b}`, `${a} − ${b}`, `${c} + ${b}`], `${c} − ${b}`)
}

// Los círculos de colores del dibujo de «la familia de la suma y la resta»
const CIRCULOS = ['🟣', '🟢', '🔵', '🟡', '🟠', '🔴']

// La familia de a + b = c (a y b distintos, c hasta 20; con dibujo, hasta 12 para poder contar): se elige la suma o la resta
// cierta entre tres. Las equivocadas ponen el total donde no toca (6 + 8 = 2) o la resta al revés (6 − 8 = 2) y son falsas siempre
function familia(spec: { ask: 'sum' | 'subtract'; drawing?: boolean }, rng: Rng): ChoiceExercise {
  let a: number
  let b: number
  do {
    ;[a, b] = spec.drawing ? [int(rng, 3, 8), int(rng, 2, 6)] : terminosInversos(rng, true)
  } while (a === b || (spec.drawing && a + b > 12))
  const c = a + b
  // sumandos en un orden cualquiera (6 + 2 y 2 + 6 valen); en la resta, el total menos uno de ellos (con dibujo, quitando los b)
  const [x, y] = spec.drawing || rng() < 0.5 ? [a, b] : [b, a]
  const [correcta, equivocadas] =
    spec.ask === 'sum'
      ? [`${x} + ${y} = ${c}`, [`${c} + ${y} = ${x}`, `${x} + ${c} = ${y}`]]
      : [`${c} − ${y} = ${x}`, [`${y} − ${c} = ${x}`, `${x} − ${y} = ${c}`]]
  const opciones = [correcta, ...equivocadas]
  if (!spec.drawing) {
    const numeros = shuffle(rng, [a, b, c])
    return elegir(`Con ${numeros[0]}, ${numeros[1]} y ${numeros[2]}, ¿qué ${spec.ask === 'sum' ? 'suma' : 'resta'} sale?`, opciones, correcta)
  }
  const [uno, otro] = shuffle(rng, CIRCULOS)
  return elegir(
    spec.ask === 'sum' ? '¿Qué suma cuenta todos los dibujos?' : `Si quitamos los ${otro}, ¿qué resta sale?`,
    opciones,
    correcta,
    `${uno.repeat(a)}  ${otro.repeat(b)}`,
  )
// Las actividades de la tabla de «información con números» (dibujo y cómo se nombra, sin « y » para no liar las etiquetas)
const ACTIVIDADES = [
  { emoji: '🏃', nombre: 'correr' },
  { emoji: '🎮', nombre: 'jugar' },
  { emoji: '📚', nombre: 'leer' },
  { emoji: '🎨', nombre: 'pintar' },
  { emoji: '⚽', nombre: 'fútbol' },
  { emoji: '🚲', nombre: 'bici' },
  { emoji: '🏊', nombre: 'nadar' },
  { emoji: '🎵', nombre: 'música' },
]

// Información con números: cuatro actividades al azar, un número del 1 al 4 cada una y colocadas al azar en una tabla de 2 × 2
// (sábado y domingo × mañana y tarde). Se pregunta el número de una casilla, los dos de un día o de un momento, o qué dibujos
// son dos números dados
function tablaDeCodigos(ask: 'cell' | 'line' | 'decode', rng: Rng): ChoiceExercise {
  const numeros = shuffle(rng, [1, 2, 3, 4])
  const elegidas = shuffle(rng, ACTIVIDADES).slice(0, 4).map((a, i) => ({ ...a, numero: numeros[i] }))
  const colocadas = shuffle(rng, elegidas)
  const grid = [
    [colocadas[0], colocadas[1]],
    [colocadas[2], colocadas[3]],
  ]
  const codeTable = {
    columns: ['Sábado', 'Domingo'],
    rows: ['Mañana', 'Tarde'],
    cells: grid.map((fila) => fila.map((a) => a.emoji)),
    legend: [...elegidas].sort((a, b) => a.numero - b.numero).map((a) => ({ emoji: a.emoji, name: a.nombre, number: a.numero })),
  }
  const dias = ['sábado', 'domingo']
  const momentos = ['mañana', 'tarde']
  if (ask === 'cell') {
    const [f, c] = [int(rng, 0, 1), int(rng, 0, 1)]
    const respuesta = grid[f][c].numero
    const otros = shuffle(rng, [1, 2, 3, 4].filter((n) => n !== respuesta)).slice(0, 2)
    return { ...elegir(`¿Qué hizo el ${dias[c]} por la ${momentos[f]}? Elige su número.`, [respuesta, ...otros], respuesta), codeTable }
  }
  if (ask === 'line') {
    // un día (la columna, de mañana a tarde) o un momento del día (la fila, de sábado a domingo)
    const porDia = rng() < 0.5
    const i = int(rng, 0, 1)
    const [x, y] = porDia ? [grid[0][i].numero, grid[1][i].numero] : [grid[i][0].numero, grid[i][1].numero]
    const pregunta = porDia
      ? `¿Qué hizo el ${dias[i]}, primero por la mañana y después por la tarde? Elige sus números.`
      : `¿Qué hizo cada día por la ${momentos[i]}, primero el sábado y después el domingo? Elige sus números.`
    const otro = pick(rng, [1, 2, 3, 4].filter((n) => n !== x && n !== y))
    return { ...elegir(pregunta, [`${x} y ${y}`, `${y} y ${x}`, `${x} y ${otro}`], `${x} y ${y}`), codeTable }
  }
  const [uno, otro, tercero] = shuffle(rng, elegidas)
  const opciones = [`${uno.emoji} ${otro.emoji}`, `${otro.emoji} ${uno.emoji}`, `${uno.emoji} ${tercero.emoji}`]
  const nombres = [[uno, otro], [otro, uno], [uno, tercero]]
  return {
    ...elegir(`Las actividades ${uno.numero} y ${otro.numero}, en ese orden. ¿Qué dibujos son?`, opciones, opciones[0]),
    labels: Object.fromEntries(opciones.map((o, k) => [o, `${nombres[k][0].nombre} y ${nombres[k][1].nombre}`])),
    codeTable,
  }
}

// Los pasos de un problema: con el texto en la tarjeta de lectura, se elige qué operación hay que hacer o qué se calcula
function pasoDeProblema(ask: 'operation' | 'calculate', rng: Rng, faltan = false): ChoiceExercise {
  const operator = faltan ? '−' : pick(rng, ['+', '−'] as const)
  const [a, b] = operandos(operator, rng)
  const text = pick(rng, historiasDe(operator, faltan))(a, b)
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

// Monumentos (todos «el/la … más alto»: la pregunta usa «monumento», sin género) con alturas que cruzan el 99 → 100:
// al menos un número de dos cifras y otro de tres, para la trampa de «el 9 es mayor que el 1» (96 m frente a 101 m)
const MONUMENTOS = ['La torre', 'La catedral', 'El faro', 'El puente', 'La pirámide', 'El castillo']

function compararAlturas(rng: Rng): ChoiceExercise {
  const nombres = shuffle(rng, MONUMENTOS).slice(0, 3)
  const alturas = new Set<number>()
  const bajos = pick(rng, [1, 2])
  while (alturas.size < bajos) alturas.add(int(rng, 80, 99))
  while (alturas.size < 3) alturas.add(int(rng, 100, 199))
  const valores = shuffle(rng, [...alturas])
  const alto = pick(rng, [true, false])
  const elegido = alto ? Math.max(...valores) : Math.min(...valores)
  return {
    ...elegir(alto ? '¿Qué monumento es más alto?' : '¿Qué monumento es más bajo?', nombres, nombres[valores.indexOf(elegido)]),
    text: `Alturas: ${nombres.map((nombre, i) => `${nombre} ${valores[i]} m`).join(', ')}.`,
  }
}

// Ordenar de menor a mayor varios números (por ejemplo seis centenas): el enunciado nunca sale ya ordenado y de las tres
// opciones solo una está ordenada (las otras son el orden inverso y el ordenado con dos vecinos cambiados)
function ordenarVarios(rng: Rng, min: number, max: number, paso: number, cuantos: number): ChoiceExercise {
  const posibles = Array.from({ length: (max - min) / paso + 1 }, (_, i) => min + i * paso)
  const elegidos = shuffle(rng, posibles).slice(0, cuantos)
  const ordenados = [...elegidos].sort((a, b) => a - b)
  let enunciado = elegidos
  while (enunciado.every((n, i) => n === ordenados[i])) enunciado = shuffle(rng, elegidos)
  const alReves = [...ordenados].reverse()
  const cambiado = [...ordenados]
  const i = int(rng, 0, cuantos - 2)
  ;[cambiado[i], cambiado[i + 1]] = [cambiado[i + 1], cambiado[i]]
  const lista = `${enunciado.slice(0, -1).join(', ')} y ${enunciado[enunciado.length - 1]}`
  return elegir(`Ordena de menor a mayor: ${lista}`, [ordenados, alReves, cambiado].map((o) => o.join(', ')), ordenados.join(', '))
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
      // Con `cross` (ignora min y max) el 99 o el 100 salen siempre, en la pregunta o en la respuesta: después del 98, 99 o 100,
      // antes del 99, 100 o 101 y entre el 98 y el 100 o entre el 99 y el 101
      if (spec.mode === 'after') {
        const n = spec.cross ? int(rng, 98, 100) : int(rng, spec.min, spec.max - 1)
        return elegir(`¿Qué número va después del ${n}?`, [n + 1, n - 1, n + 10], n + 1)
      }
      if (spec.mode === 'before') {
        const n = spec.cross ? int(rng, 99, 101) : int(rng, spec.min + 1, spec.max)
        return elegir(`¿Qué número va antes del ${n}?`, [n - 1, n + 1, n - 10], n - 1)
      }
      const n = spec.cross ? int(rng, 99, 100) : int(rng, spec.min + 1, spec.max - 1)
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
      // Con `cross` (ignora min y max) la serie pasa de menos de 100 a 100 o más (97, 98, 99, 100…; hacia atrás 101, 100, 99…)
      const inicio = spec.cross
        ? spec.down
          ? int(rng, 100, 99 + 3 * spec.step)
          : int(rng, 100 - 3 * spec.step, 99)
        : spec.down
          ? int(rng, min + 3 * spec.step, max)
          : int(rng, min, max - 3 * spec.step)
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

    case 'shape-sum': {
      // Cada figura vale un número distinto de 2 a 9 que cambia en cada ejercicio: no hay que aprenderlo, se lee en la leyenda
      const valores = shuffle(rng, [2, 3, 4, 5, 6, 7, 8, 9])
      const figuras = FIGURAS.map((figura, i) => ({ ...figura, valor: valores[i] }))
      const leyenda = figuras.map((f) => `${f.emoji} = ${f.valor}`).join('  ')
      const primera = pick(rng, figuras)
      if (spec.ask === 'sum') {
        const segunda = pick(rng, figuras) // a veces la misma: «🔺 + 🔺»
        return numero(`${primera.emoji} + ${segunda.emoji} =`, primera.valor + segunda.valor, leyenda)
      }
      // Como los valores son distintos, solo una figura completa la suma
      const buscada = pick(rng, figuras)
      const opciones = [buscada, ...shuffle(rng, figuras.filter((f) => f !== buscada)).slice(0, 2)]
      return {
        ...elegir(`¿Qué figura falta? ${primera.emoji} + ❓ = ${primera.valor + buscada.valor}`, opciones.map((o) => o.emoji), buscada.emoji, leyenda),
        labels: Object.fromEntries(opciones.map((o) => [o.emoji, o.nombre])),
      }
    }

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
      if (spec.ask === 'digit') {
        // Los números que incluyen la cifra: en las decenas o en las unidades. Son 19 para cualquier cifra del 1 al 9
        // (10 + 10 y uno repetido, el 11 o el 99); la 0 queda fuera porque la tabla enseña 00, 01… y no vale la misma regla
        const cifra = int(rng, 1, 9)
        const targets = Array.from({ length: 100 }, (_, n) => n).filter((n) => Math.floor(n / 10) === cifra || n % 10 === cifra)
        return { type: 'table-paint', question: `Toca todos los números que incluyen el ${cifra}`, targets, answer: `Hay ${targets.length} números con el ${cifra}` }
      }
      const [d, u] = [int(rng, 1, 9), int(rng, 1, 9)]
      return { type: 'table-paint', question: `Toca el número que tiene ${decenas(d)} y ${unidades(u)}`, targets: [d * 10 + u], answer: String(d * 10 + u) }
    }

    case 'digit-count': {
      // Estimar sin mirar la tabla (antes de comprobarlo tocando): 10, 19 o 25, y son 19 para cualquier cifra del 1 al 9
      const cifra = int(rng, 1, 9)
      return elegir(`Sin mirar la tabla: ¿cuántos números del 0 al 99 incluyen el ${cifra}?`, shuffle(rng, [10, 19, 25]), 19)
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
        // Del 100 al 199 todas las filas valen (la 0 es la de los 100 a 109, que empiezan por 10) y la fila 3 empieza por 13
        const ciento = spec.from === 100
        const cifra = int(rng, ciento ? 0 : minimo, 9)
        const desde = ciento ? 0 : minimo
        const otras = shuffle(rng, Array.from({ length: 10 - desde }, (_, i) => i + desde).filter((x) => x !== cifra)).slice(0, 2)
        const nombre = (c: number) => (ciento && fila ? 10 + c : c)
        return {
          ...elegir(
            fila ? 'Todos los números de la fila amarilla empiezan por…' : 'Todos los números de la columna naranja acaban en…',
            [cifra, ...otras].map(nombre),
            nombre(cifra),
          ),
          table: { ...(ciento ? { from: 100 as const } : {}), ...(fila ? { row: cifra } : { col: cifra }) },
        }
      }
      // El que falta, con su fila y su columna marcadas. Opciones: el de las cifras cambiadas (47 y 74) y un vecino
      // (del 100 al 199, el cambiado es el de las dos últimas cifras: 147 y 174)
      const desde = spec.from === 100 ? 100 : 0
      const n = spec.from === 100 ? int(rng, 100, 199) : int(rng, 10, 99)
      const [d, u] = [Math.floor((n - desde) / 10), n % 10]
      const cambiado = desde + u * 10 + d
      const vecinos = shuffle(rng, [n - 10, n - 1, n + 1, n + 10].filter((m) => m >= Math.max(10, desde) && m <= desde + 99))
      const otros = u !== 0 && u !== d ? [cambiado, vecinos[0]] : vecinos.slice(0, 2)
      return { ...elegir('¿Qué número falta?', [n, ...otros], n), table: { ...(desde === 100 ? { from: 100 as const } : {}), row: d, col: u, hole: n } }
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
      // Rango por defecto: 10 a 99. Con `step: 100` solo salen las centenas redondas (100, 200… 900)
      const min = spec.min ?? 10
      const max = spec.max ?? 99
      const paso = spec.step ?? 1
      const n = min + paso * int(rng, 0, (max - min) / paso)
      if (spec.ask === 'write') return numero(`Escribe con cifras: ${nombreNumero(n)}`, n)
      const dentro = (m: number) => m >= min && m <= max
      if (paso > 1) {
        // Centenas: se confunde con las centenas de al lado
        const otras = shuffle(rng, [n - paso, n + paso, n - 2 * paso, n + 2 * paso].filter(dentro)).slice(0, 2)
        return elegir(`¿Cómo se lee el número ${n}?`, [n, ...otras].map(nombreNumero), nombreNumero(n))
      }
      // Los números vecinos y, si las cifras son distintas, el de las cifras cambiadas (86 → 68, 117 → 171, 105 → 150)
      const base = Math.floor(n / 100) * 100
      const resto = n - base
      const cambiado = base + (resto % 10) * 10 + Math.floor(resto / 10)
      const cambiadoVale = resto % 10 !== 0 && resto % 10 !== Math.floor(resto / 10) && dentro(cambiado)
      const vecinos = shuffle(rng, [n - 10, n - 1, n + 1, n + 10].filter(dentro))
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

    case 'hundred-units': {
      if (spec.ask === 'to-tens') {
        const c = int(rng, 1, 9)
        return numero(`${centenas(c)} = ❓ decenas`, c * 10)
      }
      if (spec.ask === 'to-units') {
        const c = int(rng, 1, 9)
        return numero(`${centenas(c)} = ❓ unidades`, c * 100)
      }
      if (spec.ask === 'blocks') {
        const c = int(rng, 2, 9)
        return numero('🟥 es una centena. ¿Cuántas unidades son?', c * 100, '🟥'.repeat(c))
      }
      // Elegir el número: 70 decenas → 700. Las equivocadas son los errores típicos: repetir la cantidad (70) o dar las centenas (7)
      const c = int(rng, 2, 9)
      const enDecenas = pick(rng, [true, false])
      const cantidad = enDecenas ? c * 10 : c
      const respuesta = c * 100
      const equivocadas = [...new Set([cantidad, c, cantidad * 10])].filter((n) => n !== respuesta).slice(0, 2)
      return elegir(`¿Qué número es ${cantidad} ${enDecenas ? 'decenas' : 'centenas'}?`, [respuesta, ...equivocadas], respuesta)
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
      if (spec.mode === 'height') return compararAlturas(rng)
      // Más de tres números, o de cien en cien (centenas): ordenarVarios; si no, los tres números de siempre
      if (spec.mode === 'order' && ((spec.count ?? 3) !== 3 || (spec.step ?? 1) !== 1)) {
        return ordenarVarios(rng, spec.min ?? 10, spec.max ?? 99, spec.step ?? 1, spec.count ?? 3)
      }
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
      return columna(spec.operator, spec.carry ?? false, rng, spec.oneDigit ?? false, spec.addends ?? 2)

    case 'carry-spot':
      return sumaQueLleva(rng)

    case 'problem-step':
      return pasoDeProblema(spec.ask, rng, spec.faltan ?? false)

    case 'two-steps':
      return dosPasos(spec.mode, rng)

    case 'word-problem':
      return problema(spec.operator, spec.carry ?? false, rng, spec.faltan ?? false)

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
      // Razonar con ordinales: la lista de llegada y los pisos de un edificio
      if (spec.mode === 'ranking') return clasificacion(rng)
      if (spec.mode === 'floors') return pisos(rng)
      const lugar = int(rng, 0, 9)
      if (spec.mode === 'position') {
        const fila = shuffle(rng, ANIMALES).slice(0, 10)
        const otros = shuffle(rng, fila.filter((_, i) => i !== lugar)).slice(0, 2)
        // Con sustantivo (`noun`): «el tercer dibujo» o «la tercera figura», con su concordancia y el apócope
        const cual = spec.noun
          ? pick(rng, [true, false])
            ? `la ${ORDINALES_FEMENINOS[lugar]} figura`
            : `el ${ORDINALES_ANTE_SUSTANTIVO[lugar]} dibujo`
          : `el ${ORDINALES[lugar]}`
        return elegir(`Desde la izquierda, ¿cuál es ${cual}?`, [fila[lugar], ...otros], fila[lugar], fila.join(''))
      }
      // Femenino (`feminine`): tercera ↔ 3ª; masculino: tercero ↔ 3º. Las opciones son los ordinales de al lado, del mismo género
      const palabras = spec.feminine ? ORDINALES_FEMENINOS : ORDINALES
      const marca = spec.feminine ? 'ª' : 'º'
      const cerca = shuffle(rng, [lugar - 1, lugar + 1, lugar - 2, lugar + 2].filter((n) => n >= 0 && n <= 9)).slice(0, 2)
      if (spec.mode === 'read') {
        return elegir(`¿Cómo se lee ${lugar + 1}${marca}?`, [lugar, ...cerca].map((n) => palabras[n]), palabras[lugar])
      }
      return elegir(`¿Cómo se escribe "${palabras[lugar]}"?`, [lugar, ...cerca].map((n) => `${n + 1}${marca}`), `${lugar + 1}${marca}`)
    }

    case 'family':
      return familia(spec, rng)
    case 'code-table':
      return tablaDeCodigos(spec.ask, rng)

    case 'subtraction-terms':
      return terminosDeLaResta(rng)

    case 'check-subtraction':
      return restaBienHecha(rng)

    case 'inverse': {
      // `operation` usa siempre el rango por defecto: sus opciones equivocadas (a − b) lo necesitan
      const [a, b] = spec.mode === 'operation' ? terminosInversos(rng) : terminosInversos(rng, spec.small, spec.round)
      return inversa(spec.mode, a, b, rng)
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
      if (spec.mode === 'missing-three') {
        // El sumando que falta de tres: «5 + 1 + ▢ = 10», «4 + ▢ + 3 = 11» o al revés, «12 = 6 + 5 + ▢». Sumandos de 1 a 9 y
        // total de 10 a 13; el hueco sale en cualquiera de las tres posiciones
        let terminos: number[]
        let total: number
        do {
          terminos = [0, 1, 2].map(() => int(rng, 1, 9))
          total = terminos[0] + terminos[1] + terminos[2]
        } while (total < 10 || total > 13)
        const hueco = int(rng, 0, 2)
        const suma = terminos.map((n, i) => (i === hueco ? '▢' : String(n))).join(' + ')
        return numero(pick(rng, [true, false]) ? `Completa: ${total} = ${suma}` : `Completa: ${suma} = ${total}`, terminos[hueco])
      }
      if (spec.mode === 'compare-ten') {
        // ¿Menor o mayor que 10? Tres números del 1 al 6, y la suma nunca es exactamente 10 (no hay signo «=»)
        let numeros: number[]
        let suma: number
        do {
          numeros = [0, 1, 2].map(() => int(rng, 1, 6))
          suma = numeros[0] + numeros[1] + numeros[2]
        } while (suma === 10)
        return elegir('¿Qué signo va en el recuadro?', ['>', '<'], suma > 10 ? '>' : '<', `${numeros.join(' + ')}  ❓  10`)
      }
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
