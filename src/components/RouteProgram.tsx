import { useEffect, useRef, useState } from 'react'
import { OBSTACULOS } from '../itinerarios'
import { describeSteps, formatSteps, runProgram } from '../route'
import type { Cell, Dir, Step } from '../route'
import type { RouteProgramExercise } from '../types'
import { ArrowIcon } from './ArrowIcon'
import { Icon } from './Icon'
import { RouteMap } from './RouteMap'
import { Steps } from './Steps'

type RouteProgramProps = {
  exercise: RouteProgramExercise
  // Cuando Repi termina de moverse: si ha llegado a la meta y el programa escrito («3> 1^ 1>»)
  onResult: (correct: boolean, program: string) => void
}

const MAX_PASOS = 12 // casillas que puede recorrer un programa
const PASO_MS = 400 // lo que tarda Repi en pasar a la casilla siguiente
const PAUSA_MS = 500 // pausa al terminar, para ver dónde ha parado antes de dar la respuesta

const TECLAS = [
  { nombre: 'arriba', dir: '^', flecha: 'up' },
  { nombre: 'abajo', dir: 'v', flecha: 'down' },
  { nombre: 'izquierda', dir: '<', flecha: 'left' },
  { nombre: 'derecha', dir: '>', flecha: 'right' },
] as const satisfies readonly { nombre: string; dir: Dir; flecha: 'up' | 'down' | 'left' | 'right' }[]

// Con «reducir movimiento» no hay animación: Repi llega de golpe
const reducirMovimiento = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Programar a Repi: se pulsan las flechas para escribir el programa (los pasos seguidos en la misma dirección se juntan) y
// «¡Ir!» lo mueve por el mapa casilla a casilla. Si un árbol o el borde lo paran no se penaliza: se queda donde ha parado,
// el programa se conserva y al tocarlo Repi vuelve a la salida.
export function RouteProgram({ exercise, onResult }: RouteProgramProps) {
  const { route, goal } = exercise
  const [pasos, setPasos] = useState<Step[]>([])
  const [posicion, setPosicion] = useState<Cell>(route.start)
  const [corriendo, setCorriendo] = useState(false)
  const alTerminar = useRef(onResult)
  const temporizadores = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    alTerminar.current = onResult
  })
  useEffect(() => () => temporizadores.current.forEach(clearTimeout), [])

  const total = pasos.reduce((suma, p) => suma + p.n, 0)

  const cambiar = (nuevos: Step[]) => {
    setPasos(nuevos)
    setPosicion(route.start) // al tocar el programa, Repi vuelve a la salida
  }

  const anadir = (dir: Dir) => {
    if (total >= MAX_PASOS) return
    const ultimo = pasos.at(-1)
    cambiar(ultimo && ultimo.dir === dir ? [...pasos.slice(0, -1), { ...ultimo, n: ultimo.n + 1 }] : [...pasos, { n: 1, dir }])
  }

  const quitar = () => {
    const ultimo = pasos.at(-1)
    if (!ultimo) return
    cambiar(ultimo.n > 1 ? [...pasos.slice(0, -1), { ...ultimo, n: ultimo.n - 1 }] : pasos.slice(0, -1))
  }

  const ir = () => {
    const resultado = runProgram(route.cells, route.start, goal, pasos, OBSTACULOS)
    const escrito = formatSteps(pasos)
    const llega = resultado.outcome === 'goal'
    if (reducirMovimiento()) {
      setPosicion(resultado.positions.at(-1)!)
      onResult(llega, escrito)
      return
    }
    // Todos los pasos se programan de una vez: Repi pasa a cada casilla cada PASO_MS y, al terminar, se espera un momento
    setPosicion(route.start)
    setCorriendo(true)
    const casillas = resultado.positions.slice(1)
    casillas.forEach((casilla, i) => temporizadores.current.push(setTimeout(() => setPosicion(casilla), (i + 1) * PASO_MS)))
    temporizadores.current.push(
      setTimeout(() => {
        setCorriendo(false)
        alTerminar.current(llega, escrito)
      }, casillas.length * PASO_MS + PAUSA_MS),
    )
  }

  return (
    <>
      <RouteMap map={{ ...route, start: posicion }} />
      <div className="program" role="img" aria-label={pasos.length > 0 ? `Programa: ${describeSteps(pasos)}` : 'Programa vacío'}>
        {pasos.length > 0 ? (
          <Steps value={formatSteps(pasos)} />
        ) : (
          <span className="steps" aria-hidden="true">
            <span className="step step-empty">?</span>
          </span>
        )}
      </div>
      <div className="palette">
        {TECLAS.map(({ nombre, dir, flecha }) => (
          <button key={dir} className="option" aria-label={`Flecha ${nombre}`} disabled={corriendo} onClick={() => anadir(dir)}>
            <ArrowIcon direction={flecha} />
          </button>
        ))}
      </div>
      <div className="program-actions">
        <button className="option" aria-label="Borrar el último paso" disabled={corriendo || pasos.length === 0} onClick={quitar}>
          <Icon name="delete" />
        </button>
        <button className="action" disabled={corriendo || pasos.length === 0} onClick={ir}>
          ¡Ir!
        </button>
      </div>
    </>
  )
}
