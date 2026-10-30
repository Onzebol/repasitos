import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ComingSoon } from './components/ComingSoon'
import { Hills } from './components/Hills'
import { Mascot } from './components/Mascot'
import { SubjectsScreen } from './components/SubjectsScreen'
import { materiasInfantil } from './infantil/materias'
import { materiasPrimaria } from './primaria/materias'
import type { Profile, Subject } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'subjects'; profile: Profile }
  | { name: 'subject'; profile: Profile; subject: Subject }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const goHome = () => setScreen({ name: 'home' })

  if (screen.name === 'subjects') {
    const { profile } = screen
    return (
      <SubjectsScreen
        profile={profile}
        subjects={profile === 'infantil' ? materiasInfantil : materiasPrimaria}
        onHome={goHome}
        onSelect={(subject) => setScreen({ name: 'subject', profile, subject })}
      />
    )
  }

  if (screen.name === 'subject') {
    const { profile } = screen
    return (
      <ComingSoon
        subject={screen.subject}
        onHome={goHome}
        onBack={() => setScreen({ name: 'subjects', profile })}
      />
    )
  }

  return (
    <main className="home">
      <Hills />
      <header className="greeting">
        <Mascot size={150} />
        <p className="bubble">¡Hola! ¿Quién repasa hoy?</p>
      </header>
      <div className="profiles">
        <button
          className="profile"
          style={{ '--tint': '#ffd1dc' } as CSSProperties}
          onClick={() => setScreen({ name: 'subjects', profile: 'infantil' })}
        >
          <span className="profile-icon" aria-hidden="true">🧩</span>
          <span className="profile-name">Infantil</span>
          <small>3º de Infantil</small>
        </button>
        <button
          className="profile"
          style={{ '--tint': '#bfe3ff' } as CSSProperties}
          onClick={() => setScreen({ name: 'subjects', profile: 'primaria' })}
        >
          <span className="profile-icon" aria-hidden="true">📚</span>
          <span className="profile-name">Primaria</span>
          <small>2º de Primaria</small>
        </button>
      </div>
    </main>
  )
}

export default App
