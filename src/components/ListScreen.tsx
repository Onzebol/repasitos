import type { CSSProperties } from 'react'
import { speak } from '../speak'
import type { Profile } from '../types'
import { Hills } from './Hills'
import { TopBar } from './TopBar'

export type ListItem = {
  id: string
  name: string
  note?: string
  icon: string
  tint: string
  disabled?: boolean
}

type ListScreenProps = {
  profile: Profile
  title: string
  items: ListItem[]
  onHome: () => void
  onBack: () => void
  onSelect: (id: string) => void
}

// Lista de tarjetas grandes (unidades, temas...) con título y botón de volver
export function ListScreen({ profile, title, items, onHome, onBack, onSelect }: ListScreenProps) {
  const infantil = profile === 'infantil'
  return (
    <main className={`screen ${profile}`}>
      <Hills />
      <TopBar title={infantil ? undefined : title} prompt={title} onHome={onHome} onBack={onBack} />
      <ul className="subjects">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className="subject"
              style={{ '--tint': item.tint } as CSSProperties}
              disabled={item.disabled}
              onClick={() => {
                if (infantil) speak(item.name)
                onSelect(item.id)
              }}
            >
              <span className="subject-icon" aria-hidden="true">{item.icon}</span>
              <span className={infantil ? 'sr-only' : 'subject-name'}>{item.name}</span>
              {(item.disabled || item.note) && (
                <small className="subject-note">{item.disabled ? 'Muy pronto' : item.note}</small>
              )}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
