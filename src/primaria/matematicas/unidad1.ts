import type { ChoiceExercise, ColumnExercise, NumberExercise, Topic } from '../../types'

const elegir = (question: string, options: string[], answer: string, visual?: string): ChoiceExercise => ({
  type: 'choice',
  question,
  options,
  answer,
  visual,
})

const numero = (question: string, answer: number, visual?: string): NumberExercise => ({
  type: 'number',
  question,
  answer,
  visual,
})

const columna = (top: number, operator: '+' | '−', bottom: number): ColumnExercise => ({
  type: 'column',
  question: operator === '+' ? 'Suma en columna' : 'Resta en columna',
  operator,
  top,
  bottom,
  answer: operator === '+' ? top + bottom : top - bottom,
})

const signo = (a: number, b: number, answer: '>' | '<'): ChoiceExercise =>
  elegir('¿Qué signo va en el recuadro?', ['>', '<'], answer, `${a}  ❓  ${b}`)

const decenaCercana = (n: number, bajo: number, alto: number): ChoiceExercise =>
  elegir(`¿Cuál es la decena más cercana a ${n}?`, [String(bajo), String(alto)], String(Math.abs(n - bajo) < Math.abs(alto - n) ? bajo : alto))

const piezas = (decenas: number, unidades: number) => `${'🟦'.repeat(decenas)}  ${'🟨'.repeat(unidades)}`

// Unidad 1: números hasta el 99, decenas y unidades, signos > y <,
// sumas y restas sin llevar, decena más cercana y cálculo mental.
export const temasUnidad1: Topic[] = [
  {
    id: 'numeros-99',
    name: 'Números hasta el 99',
    icon: '🔢',
    tint: '#ffd1dc',
    exercises: [
      elegir('¿Qué número va después del 39?', ['38', '40', '49'], '40'),
      elegir('¿Qué número va antes del 60?', ['59', '61', '50'], '59'),
      elegir('¿Qué número va entre el 74 y el 76?', ['73', '75', '77'], '75'),
      elegir('¿Cuál es el número mayor?', ['58', '85', '48'], '85'),
      elegir('¿Cuál es el número menor?', ['91', '19', '29'], '19'),
      elegir('¿Cómo se lee el número 86?', ['ochenta y seis', 'sesenta y ocho', 'ochenta y cinco'], 'ochenta y seis'),
      numero('Completa la serie: 10, 20, 30, …', 40),
      numero('Completa la serie: 95, 96, 97, …', 98),
      numero('Escribe con cifras: setenta y dos', 72),
      numero('Escribe con cifras: cuarenta y cinco', 45),
    ],
  },
  {
    id: 'decenas-unidades',
    name: 'Decenas y unidades',
    icon: '🧱',
    tint: '#ffe9a8',
    exercises: [
      elegir('El número 47 tiene…', ['4 decenas y 7 unidades', '7 decenas y 4 unidades', '4 decenas y 4 unidades'], '4 decenas y 7 unidades'),
      elegir('El número 62 tiene…', ['2 decenas y 6 unidades', '6 decenas y 2 unidades', '6 decenas y 6 unidades'], '6 decenas y 2 unidades'),
      elegir('En el número 90, ¿cuántas unidades hay?', ['0', '9', '90'], '0'),
      elegir('10 unidades forman 1…', ['decena', 'centena', 'unidad'], 'decena'),
      numero('3 decenas y 5 unidades. ¿Qué número es?', 35),
      numero('8 decenas y 1 unidad. ¿Qué número es?', 81),
      numero('¿Cuántas decenas tiene el 54?', 5),
      numero('¿Cuántas unidades tiene el 73?', 3),
      numero('🟦 es una decena y 🟨 es una unidad. ¿Qué número es?', 43, piezas(4, 3)),
      numero('🟦 es una decena y 🟨 es una unidad. ¿Qué número es?', 68, piezas(6, 8)),
    ],
  },
  {
    id: 'mayor-menor',
    name: 'Los signos > y <',
    icon: '⚖️',
    tint: '#cdb9ff',
    exercises: [
      signo(47, 52, '<'),
      signo(83, 38, '>'),
      signo(29, 31, '<'),
      signo(90, 89, '>'),
      signo(66, 60, '>'),
      signo(15, 51, '<'),
      elegir('¿Qué comparación es correcta?', ['35 > 53', '53 > 35', '35 < 35'], '53 > 35'),
      elegir('Ordena de menor a mayor: 42, 24 y 44', ['24, 42, 44', '42, 24, 44', '44, 42, 24'], '24, 42, 44'),
    ],
  },
  {
    id: 'sumas-restas',
    name: 'Sumas y restas sin llevar',
    icon: '➕',
    tint: '#b5ecc1',
    exercises: [
      columna(23, '+', 14),
      columna(45, '+', 32),
      columna(61, '+', 28),
      columna(50, '+', 37),
      columna(68, '−', 25),
      columna(79, '−', 34),
      columna(96, '−', 41),
      columna(84, '−', 60),
      numero('Tengo 24 pegatinas y me regalan 15. ¿Cuántas tengo ahora?', 39),
      numero('En la bolsa hay 48 canicas. Saco 23. ¿Cuántas quedan?', 25),
    ],
  },
  {
    id: 'decena-cercana',
    name: 'La decena más cercana',
    icon: '🎯',
    tint: '#bfe3ff',
    exercises: [
      decenaCercana(43, 40, 50),
      decenaCercana(78, 70, 80),
      decenaCercana(21, 20, 30),
      decenaCercana(56, 50, 60),
      decenaCercana(94, 90, 100),
      decenaCercana(37, 30, 40),
      decenaCercana(62, 60, 70),
      decenaCercana(89, 80, 90),
    ],
  },
  {
    id: 'calculo-mental',
    name: 'Cálculo mental',
    icon: '🧠',
    tint: '#ffd2b0',
    exercises: [
      numero('6 + 7 =', 13),
      numero('9 + 5 =', 14),
      numero('8 + 8 =', 16),
      numero('20 + 30 =', 50),
      numero('40 + 50 =', 90),
      numero('70 − 30 =', 40),
      numero('90 − 60 =', 30),
      numero('15 − 6 =', 9),
      numero('13 − 5 =', 8),
      numero('60 + 40 =', 100),
    ],
  },
]
