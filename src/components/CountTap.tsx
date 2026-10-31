import { useState } from 'react'
import { speak } from '../speak'

type CountTapProps = {
  emojis: string[] // un dibujo por elemento
  onDone: () => void // se han contado todos
}

// Contar tocando (Infantil): cada dibujo se marca con el número que le toca, en el orden en que se toquen, y ese
// número se dice en voz alta. Un dibujo ya contado no se cuenta otra vez; no hay forma de equivocarse. Los dibujos
// se quedan a la vista con sus números al terminar, y es entonces cuando se elige la cifra.
export function CountTap({ emojis, onDone }: CountTapProps) {
  const [order, setOrder] = useState<number[]>([]) // posiciones tocadas, en orden

  const count = (index: number) => {
    if (order.includes(index)) return
    const next = [...order, index]
    setOrder(next)
    speak(String(next.length))
    if (next.length === emojis.length) onDone()
  }

  return (
    <div className="count-group" role="group" aria-label="Dibujos para contar">
      {emojis.map((emoji, index) => {
        const number = order.indexOf(index) + 1
        const counted = number > 0
        return (
          <button
            key={index}
            className="count-item"
            data-counted={counted}
            disabled={counted}
            aria-label={counted ? `Contado ${number}` : 'Contar'}
            onClick={() => count(index)}
          >
            <span aria-hidden="true">{emoji}</span>
            {counted && (
              <span className="count-badge" aria-hidden="true">
                {number}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
