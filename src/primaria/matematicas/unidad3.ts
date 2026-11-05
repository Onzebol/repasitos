import type { Group, Member, Topic } from '../../types'
import { temaMedidas } from './medidas'

const litros = (question: string, answer: number) => ({ type: 'number' as const, question, answer })

// El litro: cuánto cabe en cada recipiente (las categorías dejan un margen amplio: ningún recipiente está cerca del límite)
const CAPACIDADES: Group[] = [
  { id: 'menos', label: 'Menos de 1 litro' },
  { id: 'entre', label: 'Entre 1 y 10 litros' },
  { id: 'mas', label: 'Más de 10 litros' },
]

const RECIPIENTES: Member[] = [
  { label: 'una cucharilla', group: 'menos' },
  { label: 'un vaso', group: 'menos' },
  { label: 'una taza', group: 'menos' },
  { label: 'un yogur', group: 'menos' },
  { label: 'una lata de refresco', group: 'menos' },
  { label: 'un biberón', group: 'menos' },
  { label: 'una botella grande de refresco', group: 'entre' },
  { label: 'una garrafa de agua', group: 'entre' },
  { label: 'una regadera', group: 'entre' },
  { label: 'una jarra grande de agua', group: 'entre' },
  { label: 'una bañera', group: 'mas' },
  { label: 'una piscina', group: 'mas' },
  { label: 'un acuario grande', group: 'mas' },
  { label: 'el depósito de un coche', group: 'mas' },
  { label: 'un camión cisterna', group: 'mas' },
]

// Problemas con litros: solo sumas y restas (todavía no se ha visto multiplicar)
const PROBLEMAS_LITROS = [
  litros('Un cubo tiene 8 litros de agua y otro tiene 5 litros. ¿Cuántos litros hay en total?', 13),
  litros('Una garrafa tiene 20 litros. Saco 7 litros. ¿Cuántos litros quedan?', 13),
  litros('En una jarra caben 2 litros y en otra caben 3 litros. ¿Cuántos litros caben entre las dos?', 5),
  litros('Un depósito tiene 45 litros y echo 6 litros más. ¿Cuántos litros tiene ahora?', 51),
  litros('Una bañera tiene 90 litros de agua. Salen 30 litros. ¿Cuántos litros quedan?', 60),
  litros('Tengo una botella de 2 litros y otra de 5 litros. ¿Cuántos litros tengo?', 7),
  litros('Un acuario tiene 60 litros. Le echo 25 litros. ¿Cuántos litros tiene ahora?', 85),
  litros('Una cantimplora tiene 3 litros. Me bebo 1 litro. ¿Cuántos litros quedan?', 2),
]

// Unidad 3: restas llevando, centenas, decenas y unidades, el litro y cálculo mental sumando un dígito.
// Como en las unidades anteriores, cada tema es un plan de 10 ejercicios por sesión.
export const temasUnidad3: Topic[] = [
  {
    id: 'restas-llevando',
    name: 'Restas llevando',
    icon: '➖',
    tint: '#cdb9ff',
    plan: [
      { spec: { kind: 'column', operator: '−', carry: true }, count: 3 },
      { spec: { kind: 'column', operator: '−', carry: true, oneDigit: true }, count: 1 },
      { spec: { kind: 'carry-spot', operator: '−' }, count: 1 },
      { spec: { kind: 'carry-spot', operator: '−', ask: 'type' }, count: 1 },
      { spec: { kind: 'borrow-condition', ask: 'minuend-digit', carry: false }, count: 1 },
      { spec: { kind: 'borrow-condition', ask: 'subtrahend', carry: true, typed: true }, count: 1 },
      { spec: { kind: 'word-problem', operator: '−', carry: true }, count: 1 },
      { spec: { kind: 'word-problem', operator: '−', carry: true, faltan: true }, count: 1 },
    ],
  },
  {
    id: 'centenas-decenas-unidades',
    name: 'Centenas, decenas y unidades',
    icon: '💯',
    tint: '#ffd1dc',
    plan: [
      { spec: { kind: 'cdu', ask: 'read' }, count: 1 },
      { spec: { kind: 'cdu', ask: 'compose' }, count: 2 },
      { spec: { kind: 'cdu', ask: 'blocks' }, count: 1 },
      { spec: { kind: 'cdu', ask: 'count' }, count: 2 },
      { spec: { kind: 'cdu', ask: 'clue' }, count: 2 },
      { spec: { kind: 'series', step: 100, min: 100, max: 900 }, count: 1 },
      { spec: { kind: 'series', step: 100, min: 100, max: 900, down: true }, count: 1 },
    ],
  },
  {
    id: 'el-litro',
    name: 'El litro',
    icon: '🥛',
    tint: '#bfe3ff',
    plan: [
      { spec: { kind: 'classify', question: '¿Cuánta agua cabe en {item}?', groups: CAPACIDADES, items: RECIPIENTES }, count: 4 },
      { spec: { kind: 'capacity', mode: 'more' }, count: 2 },
      { spec: { kind: 'capacity', mode: 'less' }, count: 2 },
      { spec: { kind: 'bag', items: PROBLEMAS_LITROS }, count: 2 },
    ],
  },
  {
    // Medio litro y cuarto de litro (pp. 60, 61 y 68): botella 1 l, bol ½ l, vaso ¼ l
    id: 'medio-y-cuarto-de-litro',
    name: 'Medio litro y cuarto de litro',
    icon: '🥣',
    tint: '#c9e8ff',
    plan: [
      { spec: { kind: 'liter-label', ask: 'amount' }, count: 2 },
      { spec: { kind: 'liter-label', ask: 'container' }, count: 1 },
      { spec: { kind: 'liter-parts', part: 'half' }, count: 2 },
      { spec: { kind: 'liter-parts', part: 'quarter' }, count: 1 },
      { spec: { kind: 'liter-sum' }, count: 2 },
      { spec: { kind: 'liter-compare' }, count: 1 },
      { spec: { kind: 'liter-compare', fractions: true }, count: 1 },
    ],
  },
  temaMedidas,
  {
    // Laboratorio de problemas del libro (pp. 64–65): comparar con «más que…» y «menos que…»
    id: 'mas-menos-que',
    name: 'Más que, menos que',
    icon: '🧮',
    tint: '#d4ecc4',
    plan: [
      { spec: { kind: 'compare-problem', ask: 'operation' }, count: 3 },
      { spec: { kind: 'compare-problem', ask: 'calculate' }, count: 4 },
      { spec: { kind: 'compare-problem', ask: 'calculate', carry: true }, count: 3 },
    ],
  },
  {
    // Taller de gráficos del libro (p. 66): contar con dos criterios a la vez, color y tamaño, para registrar en una tabla
    id: 'contar-y-registrar',
    name: 'Contar y registrar',
    icon: '🐟',
    tint: '#c8ecf5',
    plan: [
      { spec: { kind: 'count-table', ask: 'cell' }, count: 4 },
      { spec: { kind: 'count-table', ask: 'size' }, count: 3 },
      { spec: { kind: 'count-table', ask: 'color' }, count: 3 },
    ],
  },
  {
    // El rincón de la lógica del libro (p. 69): cantidades encadenadas con «más que» y «menos que»
    id: 'desafios-y-logica',
    name: 'Desafíos y lógica',
    icon: '🧩',
    tint: '#d7f0c8',
    plan: [
      { spec: { kind: 'chain', ask: 'second' }, count: 5 },
      { spec: { kind: 'chain', ask: 'third' }, count: 5 },
    ],
  },
  {
    id: 'calculo-mental',
    name: 'Cálculo mental',
    icon: '🧠',
    tint: '#ffd2b0',
    plan: [
      { spec: { kind: 'mental', mode: 'add-digit' }, count: 2 },
      { spec: { kind: 'mental', mode: 'tens-digit' }, count: 2 },
      { spec: { kind: 'mental', mode: 'digit-first' }, count: 1 },
      { spec: { kind: 'mental', mode: 'digit-missing' }, count: 1 },
      { spec: { kind: 'shape-sum', ask: 'sum', values: 'ones-tens' }, count: 1 },
      { spec: { kind: 'shape-sum', ask: 'find', values: 'ones-tens' }, count: 1 },
      { spec: { kind: 'mental', mode: 'tens-add' }, count: 1 },
      { spec: { kind: 'mental', mode: 'tens-sub' }, count: 1 },
    ],
  },
  {
    // Repaso de la unidad (pp. 70–73): series de 100 en 100, centenas, restas llevando, litros, tres sumandos y ordenar
    id: 'repaso',
    name: 'Repaso',
    icon: '🏁',
    tint: '#cfe8ff',
    plan: [
      { spec: { kind: 'series', step: 100, min: 100, max: 900 }, count: 1 },
      { spec: { kind: 'series', step: 100, min: 100, max: 900, down: true }, count: 1 },
      { spec: { kind: 'cdu', ask: 'read' }, count: 1 },
      { spec: { kind: 'cdu', ask: 'compose' }, count: 1 },
      { spec: { kind: 'cdu', ask: 'blocks' }, count: 1 },
      { spec: { kind: 'carry-spot', operator: '−' }, count: 1 },
      { spec: { kind: 'column', operator: '−', carry: true }, count: 1 },
      { spec: { kind: 'column', operator: '+', carry: true, addends: 3 }, count: 1 },
      { spec: { kind: 'liter-sum' }, count: 1 },
      { spec: { kind: 'compare', mode: 'order', min: 100, max: 999 }, count: 1 },
    ],
  },
]
