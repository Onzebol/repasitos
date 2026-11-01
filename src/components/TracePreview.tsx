import { useState } from 'react'
import { arrowAt, DIGITS, HEIGHT, pathData, TRAZOS, WIDTH } from '../infantil/trazos'
import type { Digit, Stroke } from '../infantil/trazos'
import { CONSONANTES, TRAZOS_MAYUSCULA, TRAZOS_MINUSCULA } from '../infantil/trazos-letras'
import type { Consonante } from '../infantil/trazos-letras'
import { Hills } from './Hills'
import { Icon } from './Icon'
import { Mascot } from './Mascot'
import { TopBar } from './TopBar'
import { TraceExercise } from './TraceExercise'

// Dibujo de un recorrido: círculo numerado en la salida, flecha de sentido y punto pequeño en la llegada
function StrokeSvg({ strokes, description }: { strokes: Stroke[]; description: string }) {
  return (
    <svg className="trace-digit" viewBox={`-8 -8 ${WIDTH + 16} ${HEIGHT + 16}`} role="img" aria-label={description}>
      {/* Del último al primero: si dos trazos salen del mismo punto, queda encima el círculo del 1 */}
      {strokes.map((_, n) => {
        const i = strokes.length - 1 - n
        const stroke = strokes[i]
        const color = COLORES[i % COLORES.length]
        const [startX, startY] = stroke[0]
        const [endX, endY] = stroke[stroke.length - 1]
        const arrow = arrowAt(stroke, 0.3)
        return (
          <g key={i} stroke={color} fill="none">
            <path d={pathData(stroke)} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
            <path d={pathData(stroke)} strokeWidth="1.6" strokeDasharray="1 4" strokeLinecap="round" />
            <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
              <path d="M-4 -4 4 0-4 4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <circle data-end cx={endX} cy={endY} r="4" fill={color} stroke="none" />
            <circle data-start cx={startX} cy={startY} r="7" fill={color} stroke="none" />
            <text x={startX} y={startY + 3.5} fontSize="10" fontWeight="700" textAnchor="middle" fill="#fff" stroke="none">
              {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Hoja de consonantes (solo para ver los recorridos): sin ejercicio todavía
function LetterSheet({ title, kind, strokes }: { title: string; kind: string; strokes: Record<Consonante, Stroke[]> }) {
  return (
    <ul className="trace-grid" aria-label={title}>
      {CONSONANTES.map((letter) => {
        const shown = kind === 'minúscula' ? letter.toLowerCase() : letter
        const n = strokes[letter].length
        return (
          <li key={letter}>
            <StrokeSvg strokes={strokes[letter]} description={`Letra ${shown} ${kind}: ${n} ${n === 1 ? 'trazo' : 'trazos'}`} />
            <span className="trace-label" aria-hidden="true">{shown}</span>
          </li>
        )
      })}
    </ul>
  )
}

type TracePreviewProps = {
  onHome: () => void
}

// Colores de cada trazo (el primero en azul, el segundo en naranja)
const COLORES = ['#1f7ac4', '#e8832a']

// Hoja para adultos (#/trazo, sin botón en el inicio): el recorrido de cada cifra con el punto de salida (círculo con su
// número de orden) y una flecha con el sentido. Sirve para contrastar el orden y la dirección con los cuadernos.
export function TracePreview({ onHome }: TracePreviewProps) {
  const [selected, setSelected] = useState<Digit | null>(null)
  const [done, setDone] = useState(false)
  const close = () => {
    setSelected(null)
    setDone(false)
  }

  // Probar una cifra: el mismo ejercicio que verán en Infantil
  if (selected !== null) {
    return (
      <main className="screen trace-page">
        <Hills />
        <TopBar title={`Trazo del ${selected}`} prompt={`Repasa el número ${selected}`} onHome={onHome} onBack={close} />
        <div className="trace-content trace-try-screen">
          {done ? (
            <>
              <Mascot size={150} />
              <p className="bubble" role="status">¡Muy bien!</p>
              <button className="action" onClick={close} autoFocus>
                <Icon name="back" /> Volver a la hoja
              </button>
            </>
          ) : (
            <TraceExercise digit={selected} onDone={() => setDone(true)} />
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="screen trace-page">
      <Hills />
      <TopBar title="Trazo de los números" prompt="Trazo de los números" onHome={onHome} />
      <div className="trace-content">
        <p className="trace-note">
          Recorrido de cada cifra: el círculo numerado es la salida (con el orden del trazo), la flecha el sentido y el punto pequeño la llegada.
          Hay que comprobar que coincide con los cuadernos.
        </p>
        <ul className="trace-grid" aria-label="Cifras">
          {DIGITS.map((digit) => {
            const strokes = TRAZOS[digit]
            const description = `Cifra ${digit}: ${strokes.length} ${strokes.length === 1 ? 'trazo' : 'trazos'}`
            return (
              <li key={digit}>
                <StrokeSvg strokes={strokes} description={description} />
                <span className="trace-label" aria-hidden="true">{digit}</span>
                <button className="trace-try" onClick={() => setSelected(digit)} aria-label={`Probar el número ${digit}`}>
                  Probar
                </button>
              </li>
            )
          })}
        </ul>
        <h2 className="trace-note">Consonantes (recorridos por contrastar con el cuaderno)</h2>
        <LetterSheet title="Consonantes en mayúscula" kind="mayúscula" strokes={TRAZOS_MAYUSCULA} />
        <LetterSheet title="Consonantes en minúscula" kind="minúscula" strokes={TRAZOS_MINUSCULA} />
      </div>
    </main>
  )
}
