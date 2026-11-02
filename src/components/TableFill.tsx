import { useState } from 'react'
import type { TableFillExercise } from '../types'
import { Keypad } from './Keypad'

type TableFillProps = {
  exercise: TableFillExercise
  // Con todos los huecos escritos, dice si están bien (si no, se vacían los equivocados). Sin esto o con `solved`, no hay teclado
  onCheck?: (correct: boolean) => void
  solved?: boolean // la fila o columna completa, sin huecos
}

const POSICIONES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Completar una fila (40 a 49) o una columna (02, 12… 92) de la tabla del 0 al 99. Se ve solo esa fila o columna, con sus
// cabeceras de decenas y unidades; los huecos son botones: se toca uno y se escriben sus dos cifras con el teclado, que pasa
// solo al siguiente hueco. Al fallar solo se vacían los números equivocados.
export function TableFill({ exercise, onCheck, solved = false }: TableFillProps) {
  const { line, index, blanks } = exercise
  const fila = line === 'row'
  const [escrito, setEscrito] = useState<Record<number, string>>({})
  const [activo, setActivo] = useState(blanks[0])

  // Número que hay en una posición: en la fila, la decena fija y la unidad cambia; en la columna, al revés
  const numeroEn = (posicion: number) => String((fila ? index * 10 + posicion : posicion * 10 + index)).padStart(2, '0')
  const completo = (posicion: number, estado = escrito) => estado[posicion]?.length === 2

  const escribir = (cifra: string) => {
    const actual = escrito[activo] ?? ''
    if (actual.length >= 2) return
    const nuevo = { ...escrito, [activo]: actual + cifra }
    setEscrito(nuevo)
    if (nuevo[activo].length === 2) {
      // al siguiente hueco sin completar, empezando por los que vienen después
      const orden = [...blanks.filter((b) => b > activo), ...blanks.filter((b) => b < activo)]
      const siguiente = orden.find((b) => !completo(b, nuevo))
      if (siguiente !== undefined) setActivo(siguiente)
    }
  }

  const borrar = () => setEscrito({ ...escrito, [activo]: (escrito[activo] ?? '').slice(0, -1) })

  const comprobar = () => {
    const mal = blanks.filter((b) => escrito[b] !== numeroEn(b))
    if (mal.length === 0) return onCheck?.(true)
    setEscrito(Object.fromEntries(Object.entries(escrito).filter(([posicion]) => !mal.includes(Number(posicion)))))
    setActivo(mal[0])
    onCheck?.(false)
  }

  const marca = fila ? 'fila' : 'col'
  const lista = blanks.every((b) => completo(b))

  return (
    <>
      <div className="t99 t99-tira" role="group" aria-label={fila ? `Fila de las ${index} decenas` : `Columna de las ${index} unidades`}>
        <span aria-hidden="true" />
        {POSICIONES.map((p) => (
          <span key={`h${p}`} className="h" aria-hidden="true">
            {p}
            {fila ? 'U' : 'D'}
          </span>
        ))}
        <span className={`h ${marca}`} aria-hidden="true">
          {index}
          {fila ? 'D' : 'U'}
        </span>
        {POSICIONES.map((p) => {
          if (solved || !blanks.includes(p)) {
            return (
              <span key={p} className={`c ${marca}`}>
                {numeroEn(p)}
              </span>
            )
          }
          const [decenas, unidades] = fila ? [index, p] : [p, index]
          return (
            <button
              key={p}
              className={activo === p ? 'c hueco activo' : 'c hueco'}
              aria-label={`Decenas ${decenas}, unidades ${unidades}`}
              aria-pressed={activo === p}
              onClick={() => setActivo(p)}
            >
              {escrito[p] || '?'}
            </button>
          )
        })}
      </div>
      {!solved && <Keypad onDigit={escribir} onDelete={borrar} onSubmit={comprobar} canSubmit={lista} />}
    </>
  )
}
