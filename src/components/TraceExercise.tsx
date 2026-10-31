import { useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { arrowAt, pathData, TRAZOS, VIEWBOX } from '../infantil/trazos'
import type { Digit } from '../infantil/trazos'
import { speak } from '../speak'
import { advance, createGuide, initialState, lift, toSvgPoint, traced } from '../trace'
import type { TraceState } from '../trace'
import { Mascot } from './Mascot'

type TraceExerciseProps = {
  digit: Digit
  onDone: () => void // la cifra está repasada (con el dedo o con «Ya lo he hecho»)
}

// Repasar una cifra con el dedo, siguiendo la guía de punteado y empezando por el círculo amarillo. Sin tiempo ni
// penalizaciones: si el dedo se sale, el trazo en curso vuelve a empezar con un «¡Casi!» amable. La lógica de
// seguimiento está en src/trace.ts; aquí solo los eventos de puntero (táctil y ratón) y el dibujo.
export function TraceExercise({ digit, onDone }: TraceExerciseProps) {
  const strokes = TRAZOS[digit]
  const guide = useMemo(() => createGuide(strokes), [strokes])
  const [state, setState] = useState<TraceState>(initialState)
  const current = useRef<TraceState>(initialState) // siempre al día, aunque lleguen varios movimientos seguidos
  const previous = useRef<[number, number] | null>(null)
  const dragging = useRef(false)
  const finished = useRef(false)

  const update = (next: TraceState) => {
    current.current = next
    setState(next)
  }

  const finish = () => {
    if (finished.current) return
    finished.current = true
    speak(String(digit))
    onDone()
  }

  const point = (event: PointerEvent<SVGSVGElement>) =>
    toSvgPoint(event.currentTarget.getBoundingClientRect(), VIEWBOX, event.clientX, event.clientY)

  const press = (event: PointerEvent<SVGSVGElement>) => {
    if (finished.current) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragging.current = true
    const here = point(event)
    previous.current = here
    update(advance(guide, current.current, null, here))
  }

  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || finished.current) return
    const here = point(event)
    const next = advance(guide, current.current, previous.current, here)
    previous.current = here
    update(next)
    if (next.done) finish()
  }

  const release = () => {
    dragging.current = false
    previous.current = null
    if (!finished.current) update(lift(current.current))
  }

  const lines = traced(guide, state)
  const stroke = strokes[state.stroke]
  const arrow = arrowAt(stroke, 0.3)
  const [startX, startY] = stroke[0]

  return (
    <div className="trace-exercise">
      <svg
        className="trace-surface"
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
        role="img"
        aria-label={`Repasa el número ${digit} con el dedo`}
        onPointerDown={press}
        onPointerMove={move}
        onPointerUp={release}
        onPointerCancel={release}
      >
        {strokes.map((guideStroke, i) => (
          <path key={`lane-${i}`} className="trace-lane" d={pathData(guideStroke)} />
        ))}
        {strokes.map((guideStroke, i) => (
          <path key={`dots-${i}`} className="trace-dots" d={pathData(guideStroke)} />
        ))}
        {lines.map(
          (line, i) => line.length > 1 && <path key={`ink-${i}`} className="trace-ink" d={pathData(line)} />,
        )}
        {!state.done && (
          <g>
            <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
              <path className="trace-arrow" d="M-4 -4 4 0-4 4" />
            </g>
            <circle className="trace-start" cx={startX} cy={startY} r="7" />
            {strokes.length > 1 && (
              <text className="trace-number" x={startX} y={startY + 3.5} textAnchor="middle">
                {state.stroke + 1}
              </text>
            )}
          </g>
        )}
      </svg>
      <div className="feedback-slot" role="status">
        {state.slipped && (
          <>
            <Mascot size={56} />
            <p className="bubble small">¡Casi! Inténtalo otra vez</p>
          </>
        )}
      </div>
      <button className="action" onClick={finish}>
        Ya lo he hecho
      </button>
    </div>
  )
}
