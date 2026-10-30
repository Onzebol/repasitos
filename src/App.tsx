import { useState } from 'react'
import type { CSSProperties } from 'react'
import { ComingSoon } from './components/ComingSoon'
import { Hills } from './components/Hills'
import { ListScreen } from './components/ListScreen'
import { Mascot } from './components/Mascot'
import { Practice } from './components/Practice'
import { SubjectsScreen } from './components/SubjectsScreen'
import { materiasInfantil } from './infantil/materias'
import { unidadesPorMateria } from './primaria/contenido'
import { materiasPrimaria } from './primaria/materias'
import type { Profile, Subject, Topic, Unit } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'subjects'; profile: Profile }
  | { name: 'subject'; profile: Profile; subject: Subject }
  | { name: 'units'; subject: Subject; units: Unit[] }
  | { name: 'topics'; subject: Subject; units: Unit[]; unit: Unit }
  | { name: 'practice'; subject: Subject; units: Unit[]; unit: Unit; topic: Topic }

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
        onSelect={(subject) => {
          const units = profile === 'primaria' ? unidadesPorMateria[subject.id] : undefined
          setScreen(units ? { name: 'units', subject, units } : { name: 'subject', profile, subject })
        }}
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

  if (screen.name === 'units') {
    const { subject, units } = screen
    return (
      <ListScreen
        title={subject.name}
        items={units.map((unit) => ({ ...unit, disabled: unit.topics.length === 0 }))}
        onHome={goHome}
        onBack={() => setScreen({ name: 'subjects', profile: 'primaria' })}
        onSelect={(id) => {
          const unit = units.find((u) => u.id === id)
          if (unit) setScreen({ name: 'topics', subject, units, unit })
        }}
      />
    )
  }

  if (screen.name === 'topics') {
    const { subject, units, unit } = screen
    return (
      <ListScreen
        title={`${subject.name} · ${unit.name}`}
        items={unit.topics}
        onHome={goHome}
        onBack={() => setScreen({ name: 'units', subject, units })}
        onSelect={(id) => {
          const topic = unit.topics.find((t) => t.id === id)
          if (topic) setScreen({ name: 'practice', subject, units, unit, topic })
        }}
      />
    )
  }

  if (screen.name === 'practice') {
    const { subject, units, unit, topic } = screen
    return (
      <Practice
        key={topic.id}
        topic={topic}
        onHome={goHome}
        onBack={() => setScreen({ name: 'topics', subject, units, unit })}
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
