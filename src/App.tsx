import type { CSSProperties } from 'react'
import { Hills } from './components/Hills'
import { Mascot } from './components/Mascot'

function App() {
  return (
    <main className="home">
      <Hills />
      <header className="greeting">
        <Mascot size={150} />
        <p className="bubble">¡Hola! ¿Quién repasa hoy?</p>
      </header>
      <div className="profiles">
        <button className="profile" style={{ '--tint': '#ffd1dc' } as CSSProperties}>
          <span className="profile-icon" aria-hidden="true">🧩</span>
          <span className="profile-name">Infantil</span>
          <small>3º de Infantil</small>
        </button>
        <button className="profile" style={{ '--tint': '#bfe3ff' } as CSSProperties}>
          <span className="profile-icon" aria-hidden="true">📚</span>
          <span className="profile-name">Primaria</span>
          <small>2º de Primaria</small>
        </button>
      </div>
    </main>
  )
}

export default App
