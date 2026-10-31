import { useState } from 'react'
import type { ColumnExercise as ColumnExerciseData } from '../types'
import { Keypad } from './Keypad'

type ColumnExerciseProps = {
  exercise: ColumnExerciseData
  // Devuelve true si el resultado es correcto; si no, se vacían los cuadros
  onCheck: (value: number) => boolean
}

type Box = 'tens' | 'units'

const digitsOf = (n: number) => [Math.floor(n / 10), n % 10]

// Suma o resta en columna: un número encima del otro y el resultado en dos cuadros.
// Se empieza por las unidades; el teclado pasa solo al siguiente cuadro.
export function ColumnExercise({ exercise, onCheck }: ColumnExerciseProps) {
  const [digits, setDigits] = useState<Record<Box, string>>({ tens: '', units: '' })
  const [active, setActive] = useState<Box>('units')

  const [topTens, topUnits] = digitsOf(exercise.top)
  const [bottomTens, bottomUnits] = digitsOf(exercise.bottom)
  const ready = digits.tens !== '' && digits.units !== ''

  const write = (digit: string) => {
    setDigits({ ...digits, [active]: digit })
    if (active === 'units') setActive('tens')
  }

  const check = () => {
    if (onCheck(Number(digits.tens + digits.units))) return
    setDigits({ tens: '', units: '' })
    setActive('units')
  }

  const box = (name: Box, label: string) => (
    <button
      className={active === name ? 'column-box active' : 'column-box'}
      aria-label={label}
      aria-pressed={active === name}
      onClick={() => setActive(name)}
    >
      {digits[name] || '?'}
    </button>
  )

  return (
    <>
      <div className="column" role="group" aria-label={`${exercise.top} ${exercise.operator} ${exercise.bottom}`}>
        <span aria-hidden="true" />
        <span className="column-head" aria-hidden="true">D</span>
        <span className="column-head" aria-hidden="true">U</span>
        <span aria-hidden="true" />
        <span className="column-cell" aria-hidden="true">{topTens}</span>
        <span className="column-cell" aria-hidden="true">{topUnits}</span>
        <span className="column-sign" aria-hidden="true">{exercise.operator}</span>
        <span className="column-cell" aria-hidden="true">{bottomTens}</span>
        <span className="column-cell" aria-hidden="true">{bottomUnits}</span>
        <span className="column-line" aria-hidden="true" />
        <span aria-hidden="true" />
        {box('tens', 'Decenas')}
        {box('units', 'Unidades')}
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
