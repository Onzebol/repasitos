import { useState } from 'react'
import type { TablePaintExercise } from '../types'

type TablePaintProps = {
  exercise: TablePaintExercise
  // Al pulsar Comprobar: si las casillas marcadas son exactamente las que hay que marcar (si no, no se quita ninguna)
  onCheck?: (correct: boolean) => void
  solved?: boolean // la tabla con las casillas correctas marcadas, sin botones
}

const CIFRAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Colorear tocando en la tabla del 0 al 99: cada casilla es un botón que se marca y se desmarca al tocarlo. Al fallar no se
// dice qué falta ni qué sobra y la selección se queda como estaba para poder corregirla.
export function TablePaint({ exercise, onCheck, solved = false }: TablePaintProps) {
  const [marcadas, setMarcadas] = useState<Set<number>>(new Set())
  const objetivo = new Set(exercise.targets)

  const alternar = (numero: number) =>
    setMarcadas((antes) => {
      const ahora = new Set(antes)
      if (!ahora.delete(numero)) ahora.add(numero)
      return ahora
    })

  const comprobar = () => onCheck?.(marcadas.size === objetivo.size && [...marcadas].every((n) => objetivo.has(n)))

  return (
    <>
      <div className="t99 t99-pintar" role="group" aria-label="Tabla del 0 al 99">
        <span aria-hidden="true" />
        {CIFRAS.map((u) => (
          <span key={`u${u}`} className="h" aria-hidden="true">
            {u}U
          </span>
        ))}
        {CIFRAS.flatMap((d) => [
          <span key={`d${d}`} className="h" aria-hidden="true">
            {d}D
          </span>,
          ...CIFRAS.map((u) => {
            const n = d * 10 + u
            const texto = String(n).padStart(2, '0')
            if (solved) {
              return (
                <span key={n} className={objetivo.has(n) ? 'c sel' : 'c'}>
                  {texto}
                </span>
              )
            }
            return (
              <button key={n} className={marcadas.has(n) ? 'c sel' : 'c'} aria-pressed={marcadas.has(n)} onClick={() => alternar(n)}>
                {texto}
              </button>
            )
          }),
        ])}
      </div>
      {!solved && (
        <button className="action" disabled={marcadas.size === 0} onClick={comprobar}>
          Comprobar
        </button>
      )}
    </>
  )
}
