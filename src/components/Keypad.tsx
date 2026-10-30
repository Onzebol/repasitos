type KeypadProps = {
  onDigit: (digit: string) => void
  onDelete: () => void
  onSubmit: () => void
  canSubmit: boolean
}

// Teclado numérico en pantalla para escribir la respuesta
export function Keypad({ onDigit, onDelete, onSubmit, canSubmit }: KeypadProps) {
  return (
    <div className="keypad">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button key={digit} className="key" onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button className="key" onClick={onDelete} aria-label="Borrar">
        ⌫
      </button>
      <button className="key" onClick={() => onDigit('0')}>
        0
      </button>
      <button className="key key-ok" onClick={onSubmit} disabled={!canSubmit} aria-label="Comprobar">
        ✔
      </button>
    </div>
  )
}
