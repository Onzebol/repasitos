import type { ScoreTableData } from '../types'
import { Icon } from './Icon'

// Tabla de puntos de tres jugadores (animales): una fila por jugador con sus dos partidas y el total. Una casilla vacía se
// dibuja como ❓ (icono «gap») o, con `fill`, con ese número (al acertar).
export function ScoreTable({ data, fill }: { data: ScoreTableData; fill?: number }) {
  return (
    <div className="score-box">
      <table className="score-table" aria-label="Puntos de cada jugador">
        <thead>
          <tr>
            <td className="esquina" aria-hidden="true" />
            {data.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.players.map((p) => (
            <tr key={p.emoji}>
              <th scope="row">
                <span role="img" aria-label={p.name}>
                  {p.emoji}
                </span>
              </th>
              {p.values.map((v, j) => (
                <td key={j} className={j === 2 ? 'total' : undefined}>
                  {v === null ? fill === undefined ? <Icon name="gap" /> : fill : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
