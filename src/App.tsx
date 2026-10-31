import { useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import { ComingSoon } from './components/ComingSoon'
import { Hills } from './components/Hills'
import { Icon } from './components/Icon'
import { IconsScreen } from './components/IconsScreen'
import { TracePreview } from './components/TracePreview'
import { VoicesScreen } from './components/VoicesScreen'
import { ListScreen } from './components/ListScreen'
import { Mascot } from './components/Mascot'
import { Practice } from './components/Practice'
import { SubjectsScreen } from './components/SubjectsScreen'
import { hashFromScreen, hasContent, screenForSubject, screenFromHash, subjectsOf } from './routes'
import type { Screen } from './routes'

// La pantalla vive en la dirección (#/...): así funciona el botón atrás del navegador y del móvil
const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}
const getHash = () => window.location.hash

const setScreen = (screen: Screen) => {
  window.location.hash = hashFromScreen(screen)
}

function App() {
  const screen = screenFromHash(useSyncExternalStore(subscribe, getHash))
  const goHome = () => setScreen({ name: 'home' })

  if (screen.name === 'icons') return <IconsScreen onHome={goHome} />

  if (screen.name === 'trace') return <TracePreview onHome={goHome} />

  if (screen.name === 'voices') return <VoicesScreen onHome={goHome} />

  if (screen.name === 'subjects') {
    const { profile } = screen
    return (
      <SubjectsScreen
        profile={profile}
        subjects={subjectsOf(profile)}
        available={(subject) => hasContent(profile, subject)}
        onHome={goHome}
        onSelect={(subject) => setScreen(screenForSubject(profile, subject))}
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
    const { profile, subject, units } = screen
    return (
      <ListScreen
        profile={profile}
        title={subject.name}
        items={units.map((unit) => ({ ...unit, disabled: unit.topics.length === 0 }))}
        onHome={goHome}
        onBack={() => setScreen({ name: 'subjects', profile })}
        onSelect={(id) => {
          const unit = units.find((u) => u.id === id)
          if (unit) setScreen({ name: 'topics', profile, subject, units, unit })
        }}
      />
    )
  }

  if (screen.name === 'topics') {
    const { profile, subject, units, unit } = screen
    // En Infantil no hay unidades: atrás vuelve a las materias
    const infantil = profile === 'infantil'
    return (
      <ListScreen
        profile={profile}
        title={infantil ? subject.name : `${subject.name} · ${unit.name}`}
        items={unit.topics}
        onHome={goHome}
        onBack={() => setScreen(infantil ? { name: 'subjects', profile } : { name: 'units', profile, subject, units })}
        onSelect={(id) => {
          const topic = unit.topics.find((t) => t.id === id)
          if (topic) setScreen({ name: 'practice', profile, subject, units, unit, topic })
        }}
      />
    )
  }

  if (screen.name === 'practice') {
    const { profile, subject, units, unit, topic } = screen
    return (
      <Practice
        key={topic.id}
        profile={profile}
        topic={topic}
        onHome={goHome}
        onBack={() => setScreen({ name: 'topics', profile, subject, units, unit })}
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
          <Icon className="profile-icon" name="infantil" />
          <span className="profile-name">Infantil</span>
          <small>3º de Infantil</small>
        </button>
        <button
          className="profile"
          style={{ '--tint': '#bfe3ff' } as CSSProperties}
          onClick={() => setScreen({ name: 'subjects', profile: 'primaria' })}
        >
          <Icon className="profile-icon" name="primaria" />
          <span className="profile-name">Primaria</span>
          <small>2º de Primaria</small>
        </button>
      </div>
    </main>
  )
}

export default App
