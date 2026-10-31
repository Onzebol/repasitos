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

// Suma o resta sin llevar en columna: resultado de dos cifras (decenas y unidades)
export type ColumnExercise = {
  type: 'column'
  question: string
  operator: '+' | '−'
  top: number
  bottom: number
  answer: number
}

export type Exercise = ChoiceExercise | NumberExercise | ColumnExercise

// Un tema agrupa ejercicios de un mismo contenido (por ejemplo, "Decenas y unidades")
export type Topic = {
  id: string
  name: string
  icon: string
  tint: string
  exercises: Exercise[]
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
