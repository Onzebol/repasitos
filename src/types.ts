import type { Digit } from './infantil/trazos'

export type Profile = 'infantil' | 'primaria'

export type Subject = {
  id: string
  name: string
  icon: string
  tint: string
}

// Qué se marca en la tabla del 0 al 99: la fila de una decena (0 a 9), la columna de una unidad (0 a 9) y/o el número
// que falta (se dibuja como ❓)
export type TableMarks = { row?: number; col?: number; hole?: number }

// Mapa de un itinerario (4 filas × 5 columnas, ver src/itinerarios.ts): el dibujo de cada casilla ('' = hierba), la casilla
// donde está Repi, el camino (casillas contiguas, se tiñen de arena) y si cada casilla del camino lleva una flecha
export type RouteMapData = {
  cells: string[][]
  start: [number, number]
  path?: [number, number][]
  arrows?: boolean
}

// Elegir una respuesta entre varias
export type ChoiceExercise = {
  type: 'choice'
  question: string
  visual?: string
  // Texto para leer antes de contestar (comprensión lectora): se ve sobre las opciones y el botón de escuchar lo lee con la pregunta
  text?: string
  // Tabla del 0 al 99 dibujada entre la pregunta y las opciones, con una fila o columna marcadas y/o un número que falta
  table?: TableMarks
  // Itinerarios con flechas: mapa dibujado entre la pregunta y las opciones. `steps` son las instrucciones («3> 1^ 1>», ver
  // src/route.ts) que se ven como fichas con flechas sobre el mapa; con `stepOptions`, las opciones son itinerarios y se
  // dibujan también con flechas (su nombre accesible sale de `labels`)
  route?: RouteMapData
  steps?: string
  stepOptions?: boolean
  options: string[]
  answer: string
  // Contar tocando (Infantil): primero hay que tocar uno a uno los dibujos de `visual`; las opciones salen al contarlos todos
  tapToCount?: boolean
  // Nombre accesible de cada opción cuando el texto es un dibujo (por ejemplo «3 perros»), por opción
  labels?: Record<string, string>
  // Identidad del hecho que se pregunta (Conocimiento del medio): dos ejercicios con el mismo hecho, aunque cambien las
  // opciones o la forma de preguntar, cuentan como el mismo en una sesión (ver exerciseKey)
  fact?: string
}

// Tablas para generar preguntas de hechos (ver BlockSpec: classify, pick-member, sequence, pairs y facts)
export type Group = { id: string; label: string; question?: string } // categoría: su nombre como respuesta y (para pick-member) cómo se pregunta por ella
export type Member = { label: string; group: string; emoji?: string; plural?: boolean } // elemento de una categoría, con su artículo
export type FactItem = { question: string; answer: string; wrong: string[]; visual?: string; text?: string } // respuestas equivocadas seguras (al menos 3)
export type PairRow = { ask: string; answer: string; askBack: string; answerBack: string; emoji?: string }

// Escribir un número con el teclado en pantalla
export type NumberExercise = {
  type: 'number'
  question: string
  visual?: string
  answer: number
}

// Suma o resta en columna: el resultado se escribe cifra a cifra (unidades, decenas y, en las sumas,
// centenas: siempre visible, obligatoria solo si el resultado llega a 100). Con `carry` las unidades llevan y se muestra un cuadro de llevada opcional (no se comprueba).
export type ColumnExercise = {
  type: 'column'
  question: string
  operator: '+' | '−'
  top: number
  bottom: number
  answer: number
  carry?: boolean
}

// Repasar una cifra con el dedo siguiendo su recorrido (trazo guiado, Infantil). Su recorrido está en src/infantil/trazos.ts
export type TraceExercise = {
  type: 'trace'
  question: string
  digit: Digit
  answer: Digit // la propia cifra, para mostrarla al terminar
}

// Completar una fila o una columna de la tabla del 0 al 99 con el teclado (TableFill). Se ve solo esa fila o columna, con
// sus cabeceras, para que quepa con el teclado; cinco de los diez números hay que escribirlos y los otros cinco vienen dados
export type TableFillExercise = {
  type: 'table-fill'
  question: string
  line: 'row' | 'column' // la fila de una decena (40 a 49) o la columna de una unidad (02, 12… 92)
  index: number // la decena de la fila o la unidad de la columna, de 0 a 9
  blanks: number[] // posiciones (de 0 a 9) de los números que hay que escribir, de menor a mayor
  answer: string // «40 a 49», para mostrarlo al acertar
}

// Programar a Repi (RouteProgram): con las flechas ↑ ↓ ← → se escribe un programa y Repi lo sigue por el mapa. Acierta si
// acaba en la meta (`goal`, por cualquier camino); los árboles y el borde del mapa lo paran. `answer` es un itinerario de
// referencia que llega («3> 1^ 1>», ver src/route.ts); no se enseña
export type RouteProgramExercise = {
  type: 'route-program'
  question: string
  route: RouteMapData
  goal: [number, number]
  answer: string
}

// Colorear tocando en la tabla del 0 al 99 (TablePaint): se ve la tabla entera y se tocan las casillas que cumplen la condición
// de la pregunta («los números que tienen 2 unidades»); acierta si las marcadas son exactamente `targets`
export type TablePaintExercise = {
  type: 'table-paint'
  question: string
  targets: number[] // los números que hay que marcar, de menor a mayor
  answer: string // «Acaban en 2», para mostrarlo al acertar
}

export type Exercise = ChoiceExercise | NumberExercise | ColumnExercise | TraceExercise | TableFillExercise | RouteProgramExercise | TablePaintExercise

// Plantilla de un bloque de ejercicios: describe qué se quiere y src/generators.ts crea uno nuevo cada vez
export type BlockSpec =
  // Ejercicios escritos a mano: se toman distintos de la lista en cada sesión
  | { kind: 'bag'; items: Exercise[] }
  // ¿Qué número va después, antes o entre otros? (elegir)
  | { kind: 'neighbor'; mode: 'after' | 'before' | 'between'; min: number; max: number }
  // ¿Cuál es el número mayor o el menor de tres? (elegir). Rango por defecto: 10 a 99
  | { kind: 'extreme'; mode: 'greatest' | 'smallest'; min?: number; max?: number }
  // Completar una serie que sube (o baja, con `down`) de 1 a 5 en 1 o de 10 en 10 (escribir). Rango por defecto: 10 a 99
  | { kind: 'series'; step: 1 | 2 | 3 | 4 | 5 | 10; down?: boolean; min?: number; max?: number }
  // Decenas y unidades: leer un número, contar decenas o unidades, componerlo con cifras o con piezas
  | { kind: 'place-value'; ask: 'read' | 'tens' | 'units' | 'compose' | 'blocks' }
  // Cómo se lee un número de 10 a 99 (elegir) o escribirlo con cifras a partir de su nombre (escribir)
  | { kind: 'number-name'; ask: 'read' | 'write' }
  // Descomponer un número de dos cifras: la suma que falta, «4 decenas y 3 unidades» ↔ 40 + 3 (elegir)
  // y 30 + 4 ↔ «treinta y cuatro» (elegir)
  | { kind: 'decompose'; ask: 'sum' | 'pieces' | 'words' }
  // Decenas ↔ unidades: «3 decenas = ❓ unidades» y «30 unidades = ❓ decenas» (escribir)
  | { kind: 'tens-units'; ask: 'to-units' | 'to-tens' }
  // «¿Qué número tiene 3 decenas?» / «…7 unidades?»: elegir entre tres números de dos cifras
  | { kind: 'digit-clue'; ask: 'tens' | 'units' }
  // Comparar números: signo > o <, frase correcta u ordenar tres números (elegir). Rango por defecto: 10 a 99.
  // `complete`: qué número va en «48 > ❓» (o «❓ < 37»); `context`: quién o qué tiene el valor mayor o menor entre
  // pueblos (km), edades y mochilas (kilos), con los datos en el texto de lectura. Ambos ignoran min y max.
  | { kind: 'compare'; mode: 'sign' | 'statement' | 'order' | 'complete' | 'context'; min?: number; max?: number }
  // Centenas (de 100 a 199): leer un número con centena, decenas y unidades (elegir) o componerlo (escribir)
  | { kind: 'hundreds'; ask: 'read' | 'compose' }
  // Suma o resta en columna: sin llevar, o con `carry` (sumas: las unidades pasan de 9; restas: se pide una decena).
  // Con `oneDigit` el segundo número tiene una cifra (83 + 5, 87 − 5), sin llevar; con `oneDigit` y `carry` (solo sumas) sí se
  // lleva: 87 + 9
  | { kind: 'column'; operator: '+' | '−'; carry?: boolean; oneDigit?: boolean }
  // ¿Qué suma es llevando? (elegir): tres sumas de dos números de dos cifras, una lleva y las otras dos no
  | { kind: 'carry-spot' }
  // Pasos de un problema (elegir): a partir de un texto corto, ¿hay que sumar o restar? (`operation`) o ¿hay que calcular
  // el total o la diferencia? (`calculate`). Sin llevar
  | { kind: 'problem-step'; ask: 'operation' | 'calculate' }
  // Problema de dos pasos (escribir): sumar y restar (`add-sub`) o restar y sumar (`sub-add`), sin llevar y entre 1 y 99
  | { kind: 'two-steps'; mode: 'add-sub' | 'sub-add' }
  // Problema de suma o resta con un enunciado corto (escribir): sin llevar, o con `carry` (como en `column`)
  | { kind: 'word-problem'; operator: '+' | '−'; carry?: boolean }
  // Centenas, decenas y unidades de números de 3 cifras: leer (elegir), componer, contar con piezas 🟥🟦🟨 o contar un lugar (escribir)
  | { kind: 'cdu'; ask: 'read' | 'compose' | 'blocks' | 'count' }
  // El litro: qué recipiente tiene más o menos capacidad de tres (elegir)
  | { kind: 'capacity'; mode: 'more' | 'less' }
  // Decena más cercana a un número (elegir); con `ask`: entre qué dos decenas está, si la cifra de las unidades
  // es mayor o menor que 5, o la decena más cercana en un problema «más o menos» (por defecto: 'nearest')
  | { kind: 'nearest-ten'; ask?: 'nearest' | 'between' | 'rule' | 'approx' }
  // ¿Qué signo (+ o −) va en «a ❓ b = c»? Sumas y restas sin llevar de dos cifras (elegir)
  | { kind: 'operation-sign' }
  // La tabla del 0 al 99 dibujada (elegir): la cifra con la que empiezan los números de una fila amarilla (`row`), con la
  // que acaban los de una columna naranja (`column`) o qué número falta en un hueco (`missing`)
  | { kind: 'table-99'; ask: 'row' | 'column' | 'missing' }
  // Itinerarios con flechas en un mapa de 4 × 5 (elegir): seguir unas flechas y decir dónde se llega (`where`), elegir el
  // itinerario que recorre el camino dibujado (`which`) o por qué lugar pasa Repi al seguir unas flechas, sin pintar el camino (`passes`)
  | { kind: 'route'; ask: 'where' | 'which' | 'passes' }
  // Completar con el teclado una fila (`row`, de la decena 1 a la 9) o una columna (`column`) de la tabla del 0 al 99
  | { kind: 'table-fill'; ask: 'row' | 'column' }
  // Programar a Repi con flechas para que llegue a un lugar del mapa de 4 × 5 (itinerarios)
  | { kind: 'route-program' }
  // Colorear tocando en la tabla del 0 al 99: los números con N unidades (`units`), con N decenas (`tens`) o el que tiene
  // N decenas y M unidades (`both`, una sola casilla)
  | { kind: 'table-paint'; ask: 'units' | 'tens' | 'both' }
  // La información oculta (elegir): cuatro deportes con un número cada uno y una resta sin llevar cuyo resultado es el
  // número de uno de ellos: se pregunta qué deporte practica quien la hace
  | { kind: 'hidden-info' }
  // Figuras con valores (cálculo mental, p. 27): cuatro figuras valen un número cada una (distintos, de 2 a 9, nuevos en cada
  // ejercicio); `sum`: sumar dos figuras (escribir) y `find`: «🟩 + ❓ = 7», qué figura falta (elegir entre tres)
  | { kind: 'shape-sum'; ask: 'sum' | 'find' }
  // Cálculo mental: sumar o restar pasando la decena, o con decenas exactas (escribir); `add-small` y `sub-small`:
  // sumas que no pasan de 10 y restas de números hasta el 10
  | { kind: 'mental'; mode: 'add-bridge' | 'sub-bridge' | 'tens-add' | 'tens-sub' | 'add-three' | 'add-digit' | 'add-small' | 'sub-small' }
  // La suma y la resta se relacionan: restar para comprobar (escribir), sumando que falta (escribir)
  // o qué resta comprueba una suma (elegir)
  | { kind: 'inverse'; mode: 'subtract' | 'missing' | 'operation' }
  // ¿Cuántos hay? (Infantil): contar un grupo de animales dibujados y elegir la cifra (por defecto, del 1 al 7)
  | { kind: 'how-many'; min?: number; max?: number; tap?: boolean }
  // Conocimiento del medio: preguntas generadas a partir de tablas cerradas. Las opciones equivocadas salen de la propia
  // tabla (otras categorías, otros pasos, otras filas) o de la lista de respuestas falsas de cada pregunta, nunca de otras
  // preguntas escritas a mano. Siempre tres opciones.
  // De un elemento a su categoría. «{item}» se sustituye por el elemento; con más de tres categorías salen la correcta y dos más
  | { kind: 'classify'; question: string; groups: Group[]; items: Member[] }
  // De una categoría a uno de sus elementos: uno de la categoría y dos de otras (los elementos en plural no salen)
  | { kind: 'pick-member'; groups: Group[]; items: Member[] }
  // Orden de unos pasos: el primero, el último y el que va justo antes o justo después de uno («{step}» se sustituye por el paso).
  // Las opciones equivocadas salen de los otros pasos (nunca el que se pregunta) y de `extra`: cosas de fuera que son falsas seguro
  | { kind: 'sequence'; id: string; steps: string[]; extra?: string[]; first?: string; last?: string; after?: string; before?: string }
  // Pares que se preguntan en los dos sentidos (sentido ↔ órgano); las equivocadas son las respuestas de las otras filas
  | { kind: 'pairs'; rows: PairRow[] }
  // Preguntas con su respuesta y sus respuestas equivocadas escritas a mano (dos al azar de ellas)
  | { kind: 'facts'; items: FactItem[] }
  // ¿Dónde hay 3? (Infantil): elegir entre tres grupos de dibujos el que tiene tantos como el número (por defecto, del 1 al 7)
  | { kind: 'group'; min?: number; max?: number }
  // Antes, después y el que falta (Infantil): tres cifras para elegir (por defecto, del 1 al 9)
  | { kind: 'next-number'; mode: 'after' | 'before' | 'between'; min?: number; max?: number }
  // Más y menos (Infantil): elegir el grupo de dibujos que tiene más o menos entre dos (por defecto, del 1 al 7)
  | { kind: 'more-less'; mode: 'more' | 'less'; min?: number; max?: number }
  // Las cifras (Infantil): «Toca el número 5» entre tres cifras (por defecto, del 1 al 9)
  | { kind: 'digit'; min?: number; max?: number }
  // Trazo guiado: repasar con el dedo una cifra de min a max (por defecto, del 0 al 9)
  | { kind: 'trace'; min?: Digit; max?: Digit }
  // Rimas (Infantil): «¿Qué rima con gato?» entre tres dibujos (uno de la misma familia de rima y dos de otras)
  | { kind: 'rhyme' }
  // Sonido inicial (Infantil): «¿Cuál empieza igual que mono?» entre tres dibujos (uno con el mismo sonido y dos con otros distintos)
  | { kind: 'initial-sound' }
  // Ordinales hasta el 10.º: qué dibujo ocupa un lugar en una fila, o cómo se escribe un ordinal (elegir)
  | { kind: 'ordinal'; mode: 'position' | 'name' }

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
