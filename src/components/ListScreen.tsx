import type { CSSProperties } from 'react'
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
  title: string
  items: ListItem[]
  onHome: () => void
  onBack: () => void
  onSelect: (id: string) => void
}

// Lista de tarjetas grandes (unidades, temas...) con título y botón de volver
export function ListScreen({ title, items, onHome, onBack, onSelect }: ListScreenProps) {
  return (
    <main className="screen primaria">
      <Hills />
      <TopBar title={title} prompt={title} onHome={onHome} onBack={onBack} />
      <ul className="subjects">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className="subject"
              style={{ '--tint': item.tint } as CSSProperties}
              disabled={item.disabled}
              onClick={() => onSelect(item.id)}
            >
              <span className="subject-icon" aria-hidden="true">{item.icon}</span>
              <span className="subject-name">{item.name}</span>
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
