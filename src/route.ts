// Itinerarios con flechas: instrucciones de número y dirección («3> 1^ 1>» = 3 pasos a la derecha, 1 arriba y 1 a la derecha).
// Se escriben con > derecha, < izquierda, ^ arriba y v abajo; los componentes las dibujan con flechas SVG (Steps).

export type Dir = '>' | '<' | '^' | 'v'
export type Step = { n: number; dir: Dir }
export type Cell = [number, number] // [fila, columna]: las filas bajan y las columnas van hacia la derecha

const DELTA: Record<Dir, Cell> = { '>': [0, 1], '<': [0, -1], '^': [-1, 0], v: [1, 0] }

const HACIA: Record<Dir, string> = { '>': 'a la derecha', '<': 'a la izquierda', '^': 'hacia arriba', v: 'hacia abajo' }

export function parseSteps(text: string): Step[] {
  const partes = text.trim().split(/\s+/)
  return partes.map((parte) => {
    const instruccion = /^([1-9]\d*)([<>^v])$/.exec(parte)
    if (!instruccion) throw new Error(`Instrucción no válida: «${parte}» en «${text}»`)
    return { n: Number(instruccion[1]), dir: instruccion[2] as Dir }
  })
}

export const formatSteps = (steps: Step[]): string => steps.map((step) => `${step.n}${step.dir}`).join(' ')

// Todas las casillas por las que pasa el itinerario, empezando por la de salida (puede salirse del mapa)
export function followSteps(start: Cell, steps: Step[]): Cell[] {
  const camino: Cell[] = [start]
  let [fila, columna] = start
  for (const { n, dir } of steps) {
    for (let i = 0; i < n; i++) {
      fila += DELTA[dir][0]
      columna += DELTA[dir][1]
      camino.push([fila, columna])
    }
  }
  return camino
}

// De un camino de casillas contiguas a instrucciones: los pasos seguidos en la misma dirección se juntan
export function stepsFromPath(path: Cell[]): Step[] {
  const pasos: Step[] = []
  for (let i = 1; i < path.length; i++) {
    const delta: Cell = [path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]]
    const dir = (Object.keys(DELTA) as Dir[]).find((d) => DELTA[d][0] === delta[0] && DELTA[d][1] === delta[1])
    if (!dir) throw new Error(`Las casillas ${path[i - 1]} y ${path[i]} no son contiguas`)
    const ultimo = pasos.at(-1)
    if (ultimo && ultimo.dir === dir) ultimo.n++
    else pasos.push({ n: 1, dir })
  }
  return pasos
}

// El itinerario dicho con palabras, para lectores de pantalla y para la lectura en voz alta
export function describeSteps(steps: Step[]): string {
  const frases = steps.map(({ n, dir }) => `${n} ${n === 1 ? 'paso' : 'pasos'} ${HACIA[dir]}`)
  return frases.length < 2 ? frases.join('') : `${frases.slice(0, -1).join(', ')} y ${frases.at(-1)}`
}
