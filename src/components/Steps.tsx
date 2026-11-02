import { parseSteps } from '../route'
import type { Dir } from '../route'
import { ArrowIcon } from './ArrowIcon'

const FLECHAS = { '>': 'right', '<': 'left', '^': 'up', v: 'down' } as const satisfies Record<Dir, string>

// Instrucciones de un itinerario como fichas con número y flecha SVG («3 →  1 ↑  1 →»). Son decorativas: el nombre
// accesible lo pone quien las contiene (el grupo «Itinerario…» o el botón de la opción).
export function Steps({ value }: { value: string }) {
  return (
    <span className="steps" aria-hidden="true">
      {parseSteps(value).map((paso, i) => (
        <span key={i} className="step">
          {paso.n}
          <ArrowIcon direction={FLECHAS[paso.dir]} />
        </span>
      ))}
    </span>
  )
}
