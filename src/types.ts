import type { Digit } from './infantil/trazos'

export type Profile = 'infantil' | 'primaria'

export type Subject = {
  id: string
  name: string
  icon: string
  tint: string
}

// Qué se marca en la tabla del 0 al 99: la fila de una decena (0 a 9), la columna de una unidad (0 a 9) y/o el número
// que falta (se dibuja como ❓, con su valor completo). Con `from: 100` es la tabla del 100 al 199 (cabeceras 10D… 19D):
// `row` y `col` se siguen contando de 0 a 9 desde la tabla
export type TableMarks = { row?: number; col?: number; hole?: number; from?: 0 | 100 }

// Tabla de actividades con un número cada una (CodeTable, unidad 2): días en las columnas, momentos del día en las filas, un
// dibujo en cada casilla y la leyenda con el número de cada dibujo (de 1 a 4, de menor a mayor)
export type CodeTableData = {
  columns: string[]
  rows: string[]
  cells: string[][]
  legend: { emoji: string; name: string; number: number }[]
}

// Tabla de puntos (ScoreTable, unidad 2): tres jugadores —animales— con los puntos de dos partidas y el total. `null` es
// una casilla que falta (se dibuja como ❓)
export type ScoreTableData = {
  columns: string[]
  players: { emoji: string; name: string; values: (number | null)[] }[]
}

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
  // Tabla de actividades con números (unidad 2): se dibuja entre la pregunta y las opciones, con su leyenda
  codeTable?: CodeTableData
  // Tabla de puntos de tres jugadores (unidad 2): se dibuja entre la pregunta y las opciones
  scoreTable?: ScoreTableData
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
  // Tabla de puntos con una casilla vacía (unidad 2): el número que falta es la respuesta
  scoreTable?: ScoreTableData
  answer: number
}

// Suma o resta en columna: el resultado se escribe cifra a cifra (unidades, decenas y, en las sumas,
// centenas: siempre visible, obligatoria solo si el resultado llega a 100). Con `carry` las unidades llevan y se muestra un cuadro de llevada opcional (no se comprueba).
// Con `third` (solo sumas) hay un tercer sumando debajo de los otros dos: 15 + 14 + 7
export type ColumnExercise = {
  type: 'column'
  question: string
  operator: '+' | '−'
  top: number
  bottom: number
  third?: number
  // Texto para leer antes de calcular (los números de la bandera, unidad 2): se ve sobre la pregunta, como en los ejercicios de elegir
  text?: string
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
  // ¿Qué número va después, antes o entre otros? (elegir). Con `cross` (unidad 2) el 99 o el 100 salen siempre, en la
  // pregunta o en la respuesta, y se ignoran min y max
  | { kind: 'neighbor'; mode: 'after' | 'before' | 'between'; min: number; max: number; cross?: boolean }
  // ¿Cuál es el número mayor o el menor de tres? (elegir). Rango por defecto: 10 a 99
  | { kind: 'extreme'; mode: 'greatest' | 'smallest'; min?: number; max?: number }
  // Completar una serie que sube (o baja, con `down`) de 1 a 5 en 1 o de 10 en 10 (escribir). Rango por defecto: 10 a 99.
  // Con `cross` (unidad 2) la serie pasa del 99 al 100 (97, 98, 99, 100…) y se ignoran min y max
  | { kind: 'series'; step: 1 | 2 | 3 | 4 | 5 | 10; down?: boolean; min?: number; max?: number; cross?: boolean }
  // Decenas y unidades: leer un número, contar decenas o unidades, componerlo con cifras o con piezas
  | { kind: 'place-value'; ask: 'read' | 'tens' | 'units' | 'compose' | 'blocks' }
  // Cómo se lee un número (elegir) o escribirlo con cifras a partir de su nombre (escribir). Rango por defecto: 10 a 99;
  // con `min`/`max` hasta el 999 (ciento…) y con `step: 100` solo las centenas redondas (cien, doscientos… novecientos)
  | { kind: 'number-name'; ask: 'read' | 'write'; min?: number; max?: number; step?: number }
  // Descomponer un número de dos cifras: la suma que falta, «4 decenas y 3 unidades» ↔ 40 + 3 (elegir)
  // y 30 + 4 ↔ «treinta y cuatro» (elegir)
  | { kind: 'decompose'; ask: 'sum' | 'pieces' | 'words' }
  // Decenas ↔ unidades: «3 decenas = ❓ unidades» y «30 unidades = ❓ decenas» (escribir)
  | { kind: 'tens-units'; ask: 'to-units' | 'to-tens' }
  // Centenas ↔ decenas y unidades (1 C = 10 D = 100 U), de 1 C a 9 C: «4 centenas = ❓ decenas» y «= ❓ unidades» (escribir),
  // «🟥🟥🟥 … ¿cuántas unidades son?» con placas (escribir) y «¿Qué número es 70 decenas?» / «…9 centenas?» (elegir entre tres)
  | { kind: 'hundred-units'; ask: 'to-tens' | 'to-units' | 'blocks' | 'match' }
  // «¿Qué número tiene 3 decenas?» / «…7 unidades?»: elegir entre tres números de dos cifras
  | { kind: 'digit-clue'; ask: 'tens' | 'units' }
  // Comparar números: signo > o <, frase correcta u ordenar tres números (elegir). Rango por defecto: 10 a 99.
  // `complete`: qué número va en «48 > ❓» (o «❓ < 37»); `context`: quién o qué tiene el valor mayor o menor entre
  // pueblos (km), edades y mochilas (kilos), con los datos en el texto de lectura. Ambos ignoran min y max.
  // `height` (unidad 2): qué monumento es el más alto o el más bajo, con alturas de 80 a 199 m en el texto de lectura y
  // siempre números de dos y de tres cifras mezclados (96 y 101): ignora min y max.
  // En `order`, `count` (por defecto 3) es cuántos números se ordenan y `step` de cuánto en cuánto se eligen (100: centenas)
  | { kind: 'compare'; mode: 'sign' | 'statement' | 'order' | 'complete' | 'context' | 'height'; min?: number; max?: number; step?: number; count?: number }
  // Centenas (de 100 a 199): leer un número con centena, decenas y unidades (elegir) o componerlo (escribir)
  | { kind: 'hundreds'; ask: 'read' | 'compose' }
  // Suma o resta en columna: sin llevar, o con `carry` (sumas: las unidades pasan de 9; restas: se pide una decena).
  // Con `oneDigit` el segundo número tiene una cifra (83 + 5, 87 − 5), sin llevar; con `oneDigit` y `carry` sí se lleva, en
  // sumas (87 + 9) y en restas (65 − 8, unidad 3)
  // Con `addends: 3` (solo sumas) hay tres sumandos de una o dos cifras que siempre llevan, con resultado de hasta 99: 15 + 14 + 7
  | { kind: 'column'; operator: '+' | '−'; carry?: boolean; oneDigit?: boolean; addends?: 2 | 3 }
  // ¿Qué suma es llevando? (elegir): tres sumas de dos números de dos cifras, una lleva y las otras dos no
  // Con `operator: '−'` (unidad 3): ¿qué resta es llevando? (tres restas, una sola lleva: las unidades del minuendo son menores
  // que las del sustraendo) o, con `ask: 'type'`, una resta ya hecha (85 − 67 = 18) y se elige «Sin llevar» o «Llevando»
  | { kind: 'carry-spot'; operator?: '+' | '−'; ask?: 'pick' | 'type' }
  // Pasos de un problema (elegir): a partir de un texto corto, ¿hay que sumar o restar? (`operation`) o ¿hay que calcular
  // el total o la diferencia? (`calculate`). Sin llevar. Con `faltan` (unidad 2) solo salen restas de «¿cuántos faltan?»:
  // hace falta un total, ya hay una parte y se pregunta cuántos faltan
  | { kind: 'problem-step'; ask: 'operation' | 'calculate'; faltan?: boolean }
  // Problema de dos pasos (escribir): sumar y restar (`add-sub`) o restar y sumar (`sub-add`), sin llevar y entre 1 y 99
  | { kind: 'two-steps'; mode: 'add-sub' | 'sub-add' }
  // Problema de suma o resta con un enunciado corto (escribir): sin llevar, o con `carry` (como en `column`). Con `faltan`
  // (solo restas) el enunciado es de «¿cuántos faltan?» y no de quitar
  | { kind: 'word-problem'; operator: '+' | '−'; carry?: boolean; faltan?: boolean }
  // Centenas, decenas y unidades de números de 3 cifras: leer (elegir), componer, contar con piezas 🟥🟦🟨 o contar un lugar (escribir)
  | { kind: 'cdu'; ask: 'read' | 'compose' | 'blocks' | 'count' | 'clue' }
  // El litro: qué recipiente tiene más o menos capacidad de tres (elegir)
  | { kind: 'capacity'; mode: 'more' | 'less' }
  // Decena más cercana a un número (elegir); con `ask`: entre qué dos decenas está, si la cifra de las unidades
  // es mayor o menor que 5, o la decena más cercana en un problema «más o menos» (por defecto: 'nearest')
  | { kind: 'nearest-ten'; ask?: 'nearest' | 'between' | 'rule' | 'approx' }
  // ¿Qué signo (+ o −) va en «a ❓ b = c»? Sumas y restas sin llevar de dos cifras (elegir)
  | { kind: 'operation-sign' }
  // La tabla del 0 al 99 dibujada (elegir): la cifra con la que empiezan los números de una fila amarilla (`row`), con la
  // que acaban los de una columna naranja (`column`) o qué número falta en un hueco (`missing`)
  // Con `from: 100` (unidad 2) es la tabla del 100 al 199: la fila empieza por 10… 19, la columna acaba igual y el número
  // que falta está entre el 100 y el 199
  | { kind: 'table-99'; ask: 'row' | 'column' | 'missing'; from?: 100 }
  // Itinerarios con flechas en un mapa de 4 × 5 (elegir): seguir unas flechas y decir dónde se llega (`where`), elegir el
  // itinerario que recorre el camino dibujado (`which`) o por qué lugar pasa Repi al seguir unas flechas, sin pintar el camino (`passes`)
  | { kind: 'route'; ask: 'where' | 'which' | 'passes' }
  // Completar con el teclado una fila (`row`, de la decena 1 a la 9) o una columna (`column`) de la tabla del 0 al 99
  | { kind: 'table-fill'; ask: 'row' | 'column' }
  // Programar a Repi con flechas para que llegue a un lugar del mapa de 4 × 5 (itinerarios)
  | { kind: 'route-program' }
  // Colorear tocando en la tabla del 0 al 99: los números con N unidades (`units`), con N decenas (`tens`) o el que tiene
  // N decenas y M unidades (`both`, una sola casilla); en la unidad 2, `digit`: todos los números que incluyen una cifra del
  // 1 al 9 en las decenas o en las unidades (19 casillas)
  | { kind: 'table-paint'; ask: 'units' | 'tens' | 'both' | 'digit' }
  // Estimar sin mirar la tabla cuántos números del 0 al 99 incluyen una cifra del 1 al 9 (elegir entre 10, 19 y 25; son 19);
  // se comprueba después con `table-paint` y `digit`
  | { kind: 'digit-count' }
  // Tabla de puntuaciones, «¿quién ganó?» (unidad 2): tres animales con los puntos de dos partidas y el total, sin empates.
  // `hole`: falta una casilla (una partida o el total) y se escribe el número, restando o sumando; con la tabla completa se
  // elige `round` (en qué partida hizo más puntos un jugador), `single` (quién hizo más en una sola partida) o `winner` (quién ganó)
  | { kind: 'score-table'; ask: 'hole' | 'round' | 'single' | 'winner' }
  // Los números de la bandera (repaso acumulativo, unidad 2): cuatro números distintos de dos cifras en el texto de lectura y
  // una consigna que se calcula en columna: `max-min` suma el mayor y el menor, `two-largest` resta los dos mayores (sin pedir
  // una decena) y `three-smallest` suma los tres menores (tres sumandos). Los tres resultados llegan a 99 como mucho
  | { kind: 'flag-numbers'; ask: 'max-min' | 'two-largest' | 'three-smallest' }
  // La información oculta (elegir): cuatro deportes con un número cada uno y una resta sin llevar cuyo resultado es el
  // número de uno de ellos: se pregunta qué deporte practica quien la hace
  | { kind: 'hidden-info' }
  // Figuras con valores (cálculo mental, p. 27): cuatro figuras valen un número cada una (distintos, de 2 a 9, nuevos en cada
  // ejercicio); `sum`: sumar dos figuras (escribir) y `find`: «🟩 + ❓ = 7», qué figura falta (elegir entre tres)
  | { kind: 'shape-sum'; ask: 'sum' | 'find' }
  // Cálculo mental: sumar o restar pasando la decena, o con decenas exactas (escribir); `add-small` y `sub-small`:
  // sumas que no pasan de 10 y restas de números hasta el 10. Con tres sumandos (unidad 2): `add-three` suma tres números,
  // `missing-three` busca el que falta («4 + ▢ + 3 = 11», total de 10 a 13; escribir) y `compare-ten` elige si la suma de tres
  // números del 1 al 6 es menor o mayor que 10 (elegir `<` o `>`; nunca da 10)
  | { kind: 'mental'; mode: 'add-bridge' | 'sub-bridge' | 'tens-add' | 'tens-sub' | 'add-three' | 'missing-three' | 'compare-ten' | 'add-digit' | 'add-small' | 'sub-small' }
  // La suma y la resta se relacionan (escribir): restar para comprobar (`subtract`: c − b), las dos restas de una suma
  // (`both`: c − a o c − b), sumando que falta (`missing`: a + ▢ = c), minuendo que falta (`missing-minuend`: ▢ − b = a)
  // o qué resta comprueba una suma (`operation`, elegir). Con `small`, números pequeños (hasta 20); con `round`,
  // decenas redondas (hasta 90); `operation` ignora los dos
  | { kind: 'inverse'; mode: 'subtract' | 'both' | 'missing' | 'missing-minuend' | 'operation'; small?: boolean; round?: boolean }
  // La familia de la suma y la resta (elegir la operación completa, unidad 2): con tres números (8, 6 y 2) se elige la suma
  // que sale (`sum`: 6 + 2 = 8) o la resta (`subtract`: 8 − 6 = 2) entre tres opciones, una sola cierta. Con `drawing`, los
  // tres números salen de un dibujo de dos colores: se cuentan los dibujos (suma) o se quitan los de un color (resta)
  | { kind: 'family'; ask: 'sum' | 'subtract'; drawing?: boolean }
  // Información con números (elegir, unidad 2): una tabla de 2 × 2 (sábado y domingo, mañana y tarde) con una actividad
  // dibujada en cada casilla y un número del 1 al 4 por actividad (distintos en cada ejercicio). `cell`: el número de una
  // casilla; `line`: los dos números de un día (mañana y tarde) o de un momento (sábado y domingo), en ese orden;
  // `decode`: qué dibujos son «las actividades 3 y 1», en ese orden
  | { kind: 'code-table'; ask: 'cell' | 'line' | 'decode' }
  // Los términos de la resta (elegir): en «38 − 13 = 25», ¿cuál es el sustraendo? (se elige un número) o ¿cómo se llama el
  // 13? (se elige minuendo, sustraendo o diferencia)
  | { kind: 'subtraction-terms' }
  // ¿Está bien hecha la resta? (elegir Sí o No): una resta ya hecha, a veces con el resultado cambiado; se comprueba sumando
  | { kind: 'check-subtraction' }
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
  // Ordinales hasta el 10º (elegir): qué dibujo ocupa un lugar en una fila (`position`; con `noun`, «el tercer dibujo» o
  // «la tercera figura»), cómo se escribe un ordinal («tercero» → 3º, `name`) o cómo se lee («3º» → tercero, `read`).
  // Con `feminine`, `name` y `read` van en femenino: «tercera» ↔ 3ª. Para razonar (unidad 2): `ranking` enseña una lista de
  // llegada de nueve animales (en el texto de lectura) y pregunta quién llegó en un puesto, en qué puesto llegó un animal o
  // cuántos llegaron después de él; `floors` pregunta qué piso está uno o dos pisos por encima o por debajo de otro
  | { kind: 'ordinal'; mode: 'position' | 'name' | 'read' | 'ranking' | 'floors'; feminine?: boolean; noun?: boolean }

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
