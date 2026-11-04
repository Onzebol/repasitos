import type { TableMarks } from '../types'
import { Icon } from './Icon'

const CIFRAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// La tabla del 0 al 99: una fila por decena y una columna por unidad. Se puede marcar una fila (amarilla), una columna
// (naranja) y dejar un número como hueco (icono «gap»). El nombre accesible no dice qué fila, columna o número es: sería la respuesta.
export function HundredTable({ row, col, hole, from = 0 }: TableMarks) {
  const etiqueta = [from === 100 ? 'Tabla del 100 al 199' : 'Tabla del 0 al 99', row !== undefined && 'con una fila marcada', col !== undefined && 'con una columna marcada', hole !== undefined && 'con un número que falta']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={from === 100 ? 't99 t99-ciento' : 't99'} role="img" aria-label={etiqueta}>
      <span aria-hidden="true" />
      {CIFRAS.map((u) => (
        <span key={`u${u}`} className={u === col ? 'h col' : 'h'} aria-hidden="true">
          {u}U
        </span>
      ))}
      {CIFRAS.flatMap((d) => [
        <span key={`d${d}`} className={d === row ? 'h fila' : 'h'} aria-hidden="true">
          {from / 10 + d}D
        </span>,
        ...CIFRAS.map((u) => {
          const n = from + d * 10 + u
          const clases = ['c', d === row && 'fila', u === col && 'col', n === hole && 'hueco'].filter(Boolean).join(' ')
          return (
            <span key={n} className={clases} aria-hidden="true">
              {n === hole ? <Icon name="gap" /> : String(n).padStart(from === 100 ? 3 : 2, '0')}
            </span>
          )
        }),
      ])}
    </div>
  )
}
