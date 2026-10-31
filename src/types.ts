export type Profile = 'infantil' | 'primaria'

export type Subject = {
  id: string
  name: string
  icon: string
  tint: string
}

// Elegir una respuesta entre varias
export type ChoiceExercise = {
  type: 'choice'
  question: string
  visual?: string
  options: string[]
  answer: string
}

// Escribir un número con el teclado en pantalla
export type NumberExercise = {
  type: 'number'
  question: string
  visual?: string
  answer: number
}

// Suma o resta en columna: el resultado se escribe cifra a cifra (unidades, decenas y, si llega a 100,
// centenas). Con `carry` las unidades llevan y se muestra un cuadro de llevada opcional (no se comprueba).
export type ColumnExercise = {
  type: 'column'
  question: string
  operator: '+' | '−'
  top: number
  bottom: number
  answer: number
  carry?: boolean
}

export type Exercise = ChoiceExercise | NumberExercise | ColumnExercise

// Plantilla de un bloque de ejercicios: describe qué se quiere y src/generators.ts crea uno nuevo cada vez
export type BlockSpec =
  // Ejercicios escritos a mano: se toman distintos de la lista en cada sesión
  | { kind: 'bag'; items: Exercise[] }
  // ¿Qué número va después, antes o entre otros? (elegir)
  | { kind: 'neighbor'; mode: 'after' | 'before' | 'between'; min: number; max: number }
  // ¿Cuál es el número mayor o el menor de tres? (elegir)
  | { kind: 'extreme'; mode: 'greatest' | 'smallest' }
  // Completar una serie de 1 en 1 o de 10 en 10 (escribir)
  | { kind: 'series'; step: 1 | 10 }
  // Decenas y unidades: leer un número, contar decenas o unidades, componerlo con cifras o con piezas
  | { kind: 'place-value'; ask: 'read' | 'tens' | 'units' | 'compose' | 'blocks' }
  // Comparar números: signo > o <, frase correcta u ordenar tres números (elegir)
  | { kind: 'compare'; mode: 'sign' | 'statement' | 'order' }
  // Suma o resta en columna: sin llevar, o con `carry` (solo sumas) llevando en las unidades
  | { kind: 'column'; operator: '+' | '−'; carry?: boolean }
  // Problema de suma o resta con un enunciado corto (escribir): sin llevar, o con `carry` (solo sumas)
  | { kind: 'word-problem'; operator: '+' | '−'; carry?: boolean }
  // Decena más cercana a un número (elegir)
  | { kind: 'nearest-ten' }
  // Cálculo mental: sumar o restar pasando la decena, o con decenas exactas (escribir)
  | { kind: 'mental'; mode: 'add-bridge' | 'sub-bridge' | 'tens-add' | 'tens-sub' }

// Un bloque del plan: cuántos ejercicios de esa plantilla entran en cada sesión
export type PlanBlock = { spec: BlockSpec; count: number }

// Un tema agrupa ejercicios de un mismo contenido (por ejemplo, "Decenas y unidades").
// Su plan se convierte en una sesión distinta cada vez (ver src/session.ts).
export type Topic = {
  id: string
  name: string
  icon: string
  tint: string
  plan: PlanBlock[]
}

// Una unidad agrupa temas. Sin temas, se muestra como "Muy pronto"
export type Unit = {
  id: string
  name: string
  note: string
  icon: string
  tint: string
  topics: Topic[]
}
