import { REPI } from '../itinerarios'
import type { Cell } from '../route'
import type { RouteMapData } from '../types'
import { ArrowIcon } from './ArrowIcon'

const hacia = ([f1, c1]: Cell, [f2, c2]: Cell) => (c2 > c1 ? 'right' : c2 < c1 ? 'left' : f2 > f1 ? 'down' : 'up')

// El mapa de un itinerario: una cuadrícula de dibujos con Repi en la salida y, si hay camino, sus casillas teñidas de arena
// (y, con `arrows`, una flecha en cada casilla hacia la siguiente). El nombre accesible no cuenta el camino.
export function RouteMap({ map }: { map: RouteMapData }) {
  const camino = map.path ?? []
  return (
    <div className="route-map" role="img" aria-label={map.path ? 'Mapa con Repi y un camino' : 'Mapa con Repi'} style={{ '--cols': map.cells[0].length } as React.CSSProperties}>
      {map.cells.flatMap((fila, r) =>
        fila.map((dibujo, c) => {
          const i = camino.findIndex(([pr, pc]) => pr === r && pc === c)
          const flecha = map.arrows && i >= 0 && i < camino.length - 1 ? hacia(camino[i], camino[i + 1]) : undefined
          const esRepi = r === map.start[0] && c === map.start[1]
          return (
            <span key={`${r},${c}`} className={i >= 0 ? 'rm-cell camino' : 'rm-cell'} aria-hidden="true">
              {esRepi ? REPI : dibujo}
              {flecha && (
                <span className="rm-arrow">
                  <ArrowIcon direction={flecha} />
                </span>
              )}
            </span>
          )
        }),
      )}
    </div>
  )
}
