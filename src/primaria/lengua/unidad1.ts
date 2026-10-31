import type { FactItem, PairRow, Topic } from '../../types'
import { temasResto } from './unidad1-resto'

// Unidad 1: «¿Te gusta aprender?» (ver docs/lengua-2-primaria.md). Ejercicios escritos desde cero con el vocabulario de la
// unidad: las frases y los ejemplos son propios (los textos y las actividades del libro no se copian). Las preguntas se
// generan al azar desde tablas (src/generators.ts), así que cada sesión es distinta:
//  - lo que es una tabla cerrada (sinónimos, para qué sirve cada cosa) se pregunta en los dos sentidos y las opciones
//    equivocadas salen de las otras filas, que son falsas porque cada fila significa algo distinto;
//  - lo que es un hecho suelto lleva sus propias respuestas equivocadas, escritas a mano y seguras (al menos tres).
// Cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión.

// ── Sinónimos y palabras del colegio ───────────────────────────────────────────────────────────────────────────────────
// Sinónimos: palabras que significan lo mismo. Ninguna palabra aparece en dos filas, para que la respuesta de otra fila
// nunca pueda ser también un sinónimo de lo que se pregunta.
const par = (palabra: string, sinonimo: string): PairRow => ({
  ask: `¿Qué palabra significa lo mismo que ${palabra}?`,
  answer: sinonimo,
  askBack: `¿Qué palabra significa lo mismo que ${sinonimo}?`,
  answerBack: palabra,
})

const SINONIMOS: PairRow[] = [
  par('profesor', 'maestro'),
  par('escuela', 'colegio'),
  par('clase', 'aula'),
  par('bonito', 'hermoso'),
  par('grande', 'enorme'),
  par('contento', 'alegre'),
  par('rápido', 'veloz'),
  par('empezar', 'comenzar'),
  par('cansado', 'agotado'),
  par('casa', 'hogar'),
]

// Lo que usamos en el colegio y para qué sirve (se pregunta de ida y de vuelta). Cada utilidad es distinta de las demás.
const objeto = (nombre: string, uso: string, quePregunta: string, emoji?: string): PairRow => ({
  ask: `¿Qué usamos ${quePregunta}?`,
  answer: nombre,
  askBack: `¿Para qué ${/^(las|los)\s/.test(nombre) ? 'sirven' : 'sirve'} ${nombre}?`,
  answerBack: uso,
  emoji,
})

const COSAS: PairRow[] = [
  objeto('el lápiz', 'para escribir y dibujar', 'para escribir y dibujar', '✏️'),
  objeto('la goma', 'para borrar', 'para borrar'),
  objeto('la regla', 'para medir y trazar líneas rectas', 'para medir y trazar líneas rectas', '📏'),
  objeto('las tijeras', 'para cortar', 'para cortar', '✂️'),
  objeto('el pegamento', 'para pegar', 'para pegar'),
  objeto('el sacapuntas', 'para sacar punta al lápiz', 'para sacar punta al lápiz'),
  objeto('la mochila', 'para llevar los libros y los cuadernos', 'para llevar los libros y los cuadernos', '🎒'),
  objeto('el libro', 'para leer', 'para leer', '📖'),
]

// Las personas del colegio, y oraciones que significan lo mismo con otras palabras
const sinonimoEnOracion = (original: string, igual: string, malas: string[]): FactItem => ({
  question: `¿Qué oración significa lo mismo que «${original}»?`,
  answer: igual,
  wrong: malas,
})

const colegio: FactItem[] = [
  {
    question: '¿Cómo se llama el conjunto de las personas que dan clase en el colegio?',
    answer: 'el profesorado',
    wrong: ['el alumnado', 'el conserje', 'la mochila'],
  },
  {
    question: '¿Cómo se llama el conjunto de los niños y las niñas que van al colegio?',
    answer: 'el alumnado',
    wrong: ['el profesorado', 'el conserje', 'la directora'],
  },
  {
    question: '¿Quién abre y cierra las puertas del colegio y cuida el edificio?',
    answer: 'el conserje',
    wrong: ['el alumnado', 'el profesorado', 'el cartero'],
  },
  {
    question: '¿Quién dirige el colegio?',
    answer: 'el director o la directora',
    wrong: ['el conserje', 'el alumnado', 'el cartero'],
  },
  { question: '¿Dónde damos clase?', answer: 'en el aula', wrong: ['en la cocina', 'en el garaje', 'en el cine'] },
  sinonimoEnOracion('La escuela está cerca de la plaza', 'El colegio está cerca de la plaza.', [
    'El colegio está lejos de la plaza.',
    'El colegio está cerrado.',
    'La plaza está cerca del río.',
  ]),
  sinonimoEnOracion('La clase es muy grande', 'El aula es enorme.', [
    'El aula es diminuta.',
    'El aula es nueva.',
    'La escuela es enorme.',
  ]),
  sinonimoEnOracion('El maestro está muy contento', 'El profesor está muy alegre.', [
    'El profesor está muy triste.',
    'El profesor está muy cansado.',
    'El alumno está muy contento.',
  ]),
  sinonimoEnOracion('Los alumnos empiezan la clase', 'Los alumnos comienzan la clase.', [
    'Los alumnos terminan la clase.',
    'Los alumnos salen de la clase.',
    'Los profesores empiezan la clase.',
  ]),
  sinonimoEnOracion('El perro es muy rápido', 'El perro es veloz.', [
    'El perro es muy lento.',
    'El perro es muy grande.',
    'El gato es veloz.',
  ]),
  sinonimoEnOracion('Es una casa bonita', 'Es una casa hermosa.', ['Es una casa vieja.', 'Es una casa pequeña.', 'Es un coche hermoso.']),
]

export const temasUnidad1: Topic[] = [
  {
    id: 'sinonimos',
    name: 'Sinónimos y palabras del colegio',
    icon: '🏫',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'pairs', rows: SINONIMOS }, count: 4 },
      { spec: { kind: 'pairs', rows: COSAS }, count: 3 },
      { spec: { kind: 'facts', items: colegio }, count: 3 },
    ],
  },
  ...temasResto,
]
