import type { FactItem, Group, Member, PairRow, Topic } from '../../types'

// Instrumentos y unidades de medida (libro, unidad 3, pp. 58–59): una magnitud se mide con un instrumento y se
// expresa en una unidad. Todo son tablas cerradas: las respuestas equivocadas salen de la propia tabla.

export const TEMAS_MEDIDAS_ICONO = '📏'

// Qué medimos
export const MAGNITUDES: Group[] = [
  { id: 'longitud', label: 'La longitud' },
  { id: 'peso', label: 'El peso' },
  { id: 'capacidad', label: 'La capacidad' },
]

// Con qué lo medimos (mismos ids que las magnitudes: una situación es el mismo hecho se pregunte como se pregunte)
export const MAGNITUDES_ELEGIR: Group[] = [
  { id: 'longitud', label: 'Una cinta métrica' },
  { id: 'peso', label: 'Una báscula' },
  { id: 'capacidad', label: 'Un vaso medidor' },
]

const SITUACIONES: Member[] = [
  { label: 'lo alto que es una puerta', group: 'longitud' },
  { label: 'lo largo que es un lápiz', group: 'longitud' },
  { label: 'lo lejos que está la escuela', group: 'longitud' },
  { label: 'lo que pesa una sandía', group: 'peso' },
  { label: 'lo que pesa un perro', group: 'peso' },
  { label: 'lo pesada que es una mochila', group: 'peso' },
  { label: 'cuánta leche cabe en una jarra', group: 'capacidad' },
  { label: 'cuánta agua cabe en una botella', group: 'capacidad' },
  { label: 'cuánto zumo cabe en un vaso', group: 'capacidad' },
]

export const INSTRUMENTOS: PairRow[] = [
  { ask: '¿Qué usamos para medir el peso?', answer: 'una báscula', askBack: '¿Qué medimos con una báscula?', answerBack: 'el peso' },
  { ask: '¿Qué usamos para medir la longitud?', answer: 'una cinta métrica', askBack: '¿Qué medimos con una cinta métrica?', answerBack: 'la longitud' },
  { ask: '¿Qué usamos para medir la capacidad?', answer: 'un vaso medidor', askBack: '¿Qué medimos con un vaso medidor?', answerBack: 'la capacidad' },
]

export const UNIDADES: PairRow[] = [
  { ask: '¿En qué unidad medimos el peso?', answer: 'en kilos', askBack: '¿Qué medimos con los kilos?', answerBack: 'el peso' },
  { ask: '¿En qué unidad medimos la longitud?', answer: 'en metros', askBack: '¿Qué medimos con los metros?', answerBack: 'la longitud' },
  { ask: '¿En qué unidad medimos la capacidad?', answer: 'en litros', askBack: '¿Qué medimos con los litros?', answerBack: 'la capacidad' },
]

// Medidas del cuerpo: palmo, pie y paso miden longitudes (las respuestas equivocadas no lo son)
export const CUERPO: FactItem[] = [
  {
    question: '¿Con qué podemos medir el largo de una mesa sin cinta métrica?',
    answer: 'con palmos',
    wrong: ['con kilos', 'con litros', 'con una báscula'],
  },
  {
    question: 'Si contamos los pasos que damos de una pared a otra, ¿qué medimos?',
    answer: 'una longitud',
    wrong: ['un peso', 'una capacidad', 'un color'],
  },
  {
    question: 'Para medir el largo de la clase con los pies, ¿qué hacemos?',
    answer: 'ponemos un pie delante de otro',
    wrong: ['pesamos la clase', 'llenamos la clase con agua', 'contamos los lápices'],
  },
  {
    question: '¿Qué medimos con los palmos, los pies y los pasos?',
    answer: 'longitudes',
    wrong: ['pesos', 'capacidades', 'sabores'],
  },
]

// Peso de los animales: tres animales en la pregunta, con diferencias enormes, nunca animales parecidos
const peso = (modo: 'más' | 'menos', respuesta: string, otros: [string, string]): FactItem => {
  const lista = [respuesta, ...otros].sort().join(', ').replace(/, ([^,]*)$/, ' o $1')
  return { question: `¿Qué animal pesa ${modo}: ${lista}?`, answer: respuesta, wrong: otros }
}
export const PESOS: FactItem[] = [
  peso('más', 'la ballena', ['el elefante', 'el gato']),
  peso('más', 'el elefante', ['el caballo', 'el ratón']),
  peso('más', 'el caballo', ['el gato', 'la mariposa']),
  peso('más', 'el gato', ['el ratón', 'la hormiga']),
  peso('menos', 'la mariposa', ['el elefante', 'el caballo']),
  peso('menos', 'el ratón', ['el gato', 'el caballo']),
  peso('menos', 'la hormiga', ['el gato', 'el ratón']),
]

export const temaMedidas: Topic = {
  id: 'instrumentos-y-unidades',
  name: 'Instrumentos y unidades',
  icon: TEMAS_MEDIDAS_ICONO,
  tint: '#ffe0a8',
  plan: [
    { spec: { kind: 'classify', question: 'Si queremos saber {item}, ¿qué medimos?', groups: MAGNITUDES, items: SITUACIONES }, count: 2 },
    { spec: { kind: 'classify', question: 'Para saber {item}, ¿qué usamos?', groups: MAGNITUDES_ELEGIR, items: SITUACIONES }, count: 2 },
    { spec: { kind: 'pairs', rows: INSTRUMENTOS }, count: 1 },
    { spec: { kind: 'pairs', rows: UNIDADES }, count: 1 },
    { spec: { kind: 'facts', items: CUERPO }, count: 1 },
    { spec: { kind: 'facts', items: PESOS }, count: 3 },
  ],
}
