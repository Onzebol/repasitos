import type { CSSProperties } from 'react'
import type { Profile, Subject } from '../types'
import { speak } from '../speak'
import { Hills } from './Hills'
import { TopBar } from './TopBar'

type SubjectsScreenProps = {
  profile: Profile
  subjects: Subject[]
  available: (subject: Subject) => boolean // las materias sin contenido todavía se muestran desactivadas
  onHome: () => void
  onSelect: (subject: Subject) => void
}

export function SubjectsScreen({ profile, subjects, available, onHome, onSelect }: SubjectsScreenProps) {
  const infantil = profile === 'infantil'
  const prompt = 'Elige una materia'

  return (
    <main className={`screen ${profile}`}>
      <Hills />
      <TopBar title={infantil ? undefined : prompt} prompt={prompt} onHome={onHome} />
      <ul className="subjects">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <button
              className="subject"
              disabled={!available(subject)}
              style={{ '--tint': subject.tint } as CSSProperties}
              onClick={() => {
                if (infantil) speak(subject.name)
                onSelect(subject)
              }}
            >
              <span className="subject-icon" aria-hidden="true">{subject.icon}</span>
              <span className={infantil ? 'sr-only' : 'subject-name'}>{subject.name}</span>
              {!infantil && !available(subject) && <small className="subject-note" aria-hidden="true">Muy pronto</small>}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
