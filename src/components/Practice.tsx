import { useState } from 'react'
import { randomRng } from '../random'
import type { Rng } from '../random'
import { buildSession, exerciseKey } from '../session'
import type { Topic } from '../types'
import { ColumnExercise } from './ColumnExercise'
import { Hills } from './Hills'
import { Keypad } from './Keypad'
import { Mascot } from './Mascot'
import { TopBar } from './TopBar'

type PracticeProps = {
  topic: Topic
  onHome: () => void
  onBack: () => void
  rng?: Rng // los tests pasan uno con semilla
}

// Sesión de ejercicios de un tema, distinta cada vez. Sin tiempo ni límite de intentos: el error se corrige con ánimo.
export function Practice({ topic, onHome, onBack, rng }: PracticeProps) {
  const [random] = useState<Rng>(() => rng ?? randomRng())
  const [session, setSession] = useState(() => buildSession(topic.plan, random))
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [tried, setTried] = useState<string[]>([])
  const [input, setInput] = useState('')

  const total = session.length
  const finished = index >= total
  const exercise = session[index]

  const next = () => {
    setIndex(index + 1)
    setSolved(false)
    setFailed(false)
    setTried([])
    setInput('')
  }

  // Repetir empieza otra sesión, evitando los ejercicios de la anterior
  const restart = () => {
    setSession(buildSession(topic.plan, random, session.map(exerciseKey)))
    setIndex(0)
    setSolved(false)
    setFailed(false)
    setTried([])
    setInput('')
  }

  const answerChoice = (option: string) => {
    if (exercise.type !== 'choice') return
    if (option === exercise.answer) {
      setSolved(true)
      setFailed(false)
    } else {
      setFailed(true)
      setTried([...tried, option])
    }
  }

  const checkNumber = () => {
    if (exercise.type !== 'number' || input === '') return
    if (Number(input) === exercise.answer) {
      setSolved(true)
      setFailed(false)
    } else {
      setFailed(true)
      setInput('')
    }
  }

  // Devuelve si el resultado en columna es correcto (si no, ColumnExercise vacía los cuadros)
  const checkColumn = (value: number) => {
    const correct = exercise.type === 'column' && value === exercise.answer
    setSolved(correct)
    setFailed(!correct)
    return correct
  }

  if (finished) {
    return (
      <main className="screen primaria">
        <Hills />
        <TopBar prompt="¡Muy bien! Has terminado" onHome={onHome} onBack={onBack} />
        <section className="coming-soon">
          <Mascot size={180} />
          <p className="bubble" role="status">¡Muy bien! Has terminado</p>
          <button className="action" onClick={restart}>
            <span aria-hidden="true">↻</span> Repetir
          </button>
          <button className="action" onClick={onBack}>
            <span aria-hidden="true">◀</span> Elegir otro tema
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="screen primaria">
      <Hills />
      <TopBar title={topic.name} prompt={exercise.question} onHome={onHome} onBack={onBack} />
      <section className="practice">
        <div className="progress" aria-label={`Ejercicio ${index + 1} de ${total}`}>
          {session.map((_, i) => (
            <span key={i} className={i < index ? 'dot done' : i === index ? 'dot current' : 'dot'} />
          ))}
        </div>

        <h2 className="question">{exercise.question}</h2>
        {exercise.type !== 'column' && exercise.visual && (
          // Cada bloque (decenas, unidades…) va aparte: si no caben juntos, pasan a otra línea
          <p className="visual" aria-hidden="true">
            {exercise.visual.split('  ').map((part, i) => (
              <span key={i} className="visual-part">{part}</span>
            ))}
          </p>
        )}

        {solved ? (
          <div className="feedback solved" role="status">
            <p className="answer-ok">
              <span aria-hidden="true">✔</span> {exercise.answer}
            </p>
            <Mascot size={150} />
            <p className="bubble">¡Muy bien!</p>
            <button className="action" onClick={next} autoFocus>
              {index + 1 < total ? 'Siguiente' : 'Terminar'} <span aria-hidden="true">▶</span>
            </button>
          </div>
        ) : (
          <>
            <div className="feedback-slot" role="status">
              {failed && (
                <>
                  <Mascot size={56} />
                  <p className="bubble small">¡Casi! Inténtalo otra vez</p>
                </>
              )}
            </div>
            {exercise.type === 'choice' ? (
              <div className="options">
                {exercise.options.map((option) => (
                  <button
                    key={option}
                    className="option"
                    disabled={tried.includes(option)}
                    onClick={() => answerChoice(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : exercise.type === 'column' ? (
              <ColumnExercise key={index} exercise={exercise} onCheck={checkColumn} />
            ) : (
              <>
                <output className="answer-box" aria-label="Tu respuesta">{input || '?'}</output>
                <Keypad
                  onDigit={(digit) => input.length < 3 && setInput(input + digit)}
                  onDelete={() => setInput(input.slice(0, -1))}
                  onSubmit={checkNumber}
                  canSubmit={input !== ''}
                />
              </>
            )}
          </>
        )}
      </section>
    </main>
  )
}
