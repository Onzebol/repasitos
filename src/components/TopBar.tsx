import { speak } from '../speak'

type TopBarProps = {
  title?: string
  prompt: string
  onHome: () => void
}

export function TopBar({ title, prompt, onHome }: TopBarProps) {
  return (
    <header className="topbar">
      <button className="round-button" onClick={onHome} aria-label="Volver al inicio">
        <span aria-hidden="true">🏠</span>
      </button>
      {title && <h1 className="topbar-title">{title}</h1>}
      <button className="round-button push-right" onClick={() => speak(prompt)} aria-label="Escuchar">
        <span aria-hidden="true">🔊</span>
      </button>
    </header>
  )
}
