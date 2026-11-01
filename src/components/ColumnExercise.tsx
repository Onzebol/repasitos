import { useState } from 'react'
import type { ColumnExercise as ColumnExerciseData } from '../types'
import { Keypad } from './Keypad'

type ColumnExerciseProps = {
  exercise: ColumnExerciseData
  // Devuelve true si el resultado es correcto; si no, se vacían los cuadros
  onCheck: (value: number) => boolean
}

type Place = 'hundreds' | 'tens' | 'units'
type Box = Place | 'carry'

const EMPTY: Record<Box, string> = { hundreds: '', tens: '', units: '', carry: '' }

const LABELS: Record<Box, string> = { hundreds: 'Centenas', tens: 'Decenas', units: 'Unidades', carry: 'Llevada' }
const HEADS: Record<Place, string> = { hundreds: 'C', tens: 'D', units: 'U' }

// Suma o resta en columna: un número encima del otro y el resultado en un cuadro por cifra.
// Se empieza por las unidades; el teclado pasa solo al siguiente cuadro. Las sumas tienen siempre el cuadro
// de las centenas (obligatorio solo si el resultado llega a 100). En las sumas llevando hay un cuadro de
// llevada opcional que no se comprueba.
export function ColumnExercise({ exercise, onCheck }: ColumnExerciseProps) {
  const [digits, setDigits] = useState<Record<Box, string>>(EMPTY)
  const [active, setActive] = useState<Box>('units')

  // Las sumas llevan siempre el cuadro de centenas (para que su presencia no dé pistas); las restas, nunca
  const places: Place[] = exercise.operator === '+' ? ['hundreds', 'tens', 'units'] : ['tens', 'units']
  // Si el resultado no llega a 100, la centena puede quedar vacía (o con 0)
  const required = places.filter((place) => place !== 'hundreds' || exercise.answer >= 100)
  const ready = required.every((place) => digits[place] !== '')

  const write = (digit: string) => {
    setDigits({ ...digits, [active]: digit })
    // units → decenas → centenas; tras la llevada se vuelve a las decenas
    if (active === 'units') setActive('tens')
    else if (active === 'carry') setActive('tens')
    else if (active === 'tens' && places.includes('hundreds')) setActive('hundreds')
    // (en las restas no hay centenas y el foco se queda en las decenas)
  }

  const check = () => {
    if (onCheck(Number(places.map((place) => digits[place]).join('')))) return // '' + '3' + '7' → 37
    setDigits(EMPTY)
    setActive('units')
  }

  const box = (name: Box) => (
    <button
      key={name}
      className={active === name ? `column-box ${name === 'carry' ? 'carry ' : ''}active` : `column-box${name === 'carry' ? ' carry' : ''}`}
      aria-label={LABELS[name]}
      aria-pressed={active === name}
      onClick={() => setActive(name)}
    >
      {digits[name] || '?'}
    </button>
  )

  // Cifra de un operando en cada columna (las centenas quedan en blanco: los operandos tienen dos cifras)
  const cell = (n: number, place: Place) =>
    place === 'hundreds' ? '' : place === 'tens' ? Math.floor(n / 10) : n % 10
  const blank = (key: string) => <span key={key} aria-hidden="true" />
  const row = (render: (place: Place) => React.ReactNode, first: React.ReactNode = blank('first')) => [first, ...places.map(render)]

  return (
    <>
      <div
        className="column"
        role="group"
        aria-label={`${exercise.top} ${exercise.operator} ${exercise.bottom}`}
        style={{ '--places': places.length } as React.CSSProperties}
      >
        {exercise.carry && row((place) => (place === 'tens' ? box('carry') : blank(place)))}
        {row((place) => <span key={place} className="column-head" aria-hidden="true">{HEADS[place]}</span>)}
        {row((place) => <span key={place} className="column-cell" aria-hidden="true">{cell(exercise.top, place)}</span>)}
        {row(
          (place) => <span key={place} className="column-cell" aria-hidden="true">{cell(exercise.bottom, place)}</span>,
          <span key="sign" className="column-sign" aria-hidden="true">{exercise.operator}</span>,
        )}
        <span className="column-line" aria-hidden="true" />
        {row((place) => box(place))}
      </div>
      <Keypad
        onDigit={write}
        onDelete={() => setDigits({ ...digits, [active]: '' })}
        onSubmit={check}
        canSubmit={ready}
      />
    </>
  )
}
