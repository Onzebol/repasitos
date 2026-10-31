import { arrowAt, DIGITS, HEIGHT, pathData, TRAZOS, WIDTH } from '../infantil/trazos'
import { Hills } from './Hills'
import { TopBar } from './TopBar'

type TracePreviewProps = {
  onHome: () => void
}

// Colores de cada trazo (el primero en azul, el segundo en naranja)
const COLORES = ['#1f7ac4', '#e8832a']

// Hoja para adultos (#/trazo, sin botón en el inicio): el recorrido de cada cifra con el punto de salida (círculo con su
// número de orden) y una flecha con el sentido. Sirve para contrastar el orden y la dirección con los cuadernos.
export function TracePreview({ onHome }: TracePreviewProps) {
  return (
    <main className="screen trace-page">
      <Hills />
      <TopBar title="Trazo de los números" prompt="Trazo de los números" onHome={onHome} />
      <div className="trace-content">
        <p className="trace-note">
          Recorrido de cada cifra: el círculo es el punto de salida (con el número de orden del trazo) y la flecha, el sentido.
          Hay que comprobar que coincide con los cuadernos.
        </p>
        <ul className="trace-grid" aria-label="Cifras">
          {DIGITS.map((digit) => {
            const strokes = TRAZOS[digit]
            const description = `Cifra ${digit}: ${strokes.length} ${strokes.length === 1 ? 'trazo' : 'trazos'}`
            return (
              <li key={digit}>
                <svg
                  className="trace-digit"
                  viewBox={`-8 -8 ${WIDTH + 16} ${HEIGHT + 16}`}
                  role="img"
                  aria-label={description}
                >
                  {/* Del último al primero: si dos trazos salen del mismo punto, queda encima el círculo del 1 */}
                  {strokes.map((_, n) => {
                    const i = strokes.length - 1 - n
                    const stroke = strokes[i]
                    const color = COLORES[i % COLORES.length]
                    const [startX, startY] = stroke[0]
                    const arrow = arrowAt(stroke, 0.3)
                    return (
                      <g key={i} stroke={color} fill="none">
                        <path d={pathData(stroke)} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
                        <path d={pathData(stroke)} strokeWidth="1.6" strokeDasharray="1 4" strokeLinecap="round" />
                        <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
                          <path d="M-4 -4 4 0-4 4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <circle data-start cx={startX} cy={startY} r="7" fill={color} stroke="none" />
                        <text x={startX} y={startY + 3.5} fontSize="10" fontWeight="700" textAnchor="middle" fill="#fff" stroke="none">
                          {i + 1}
                        </text>
                      </g>
                    )
                  })}
                </svg>
                <span className="trace-label" aria-hidden="true">{digit}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
