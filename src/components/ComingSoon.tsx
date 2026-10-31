import type { Subject } from '../types'
import { Hills } from './Hills'
import { Icon } from './Icon'
import { Mascot } from './Mascot'
import { TopBar } from './TopBar'

type ComingSoonProps = {
  subject: Subject
  onHome: () => void
  onBack: () => void
}

export function ComingSoon({ subject, onHome, onBack }: ComingSoonProps) {
  return (
    <main className="screen">
      <Hills />
      <TopBar prompt={`${subject.name}. ¡Muy pronto!`} onHome={onHome} />
      <section className="coming-soon">
        <span className="subject-icon big" aria-hidden="true" style={{ background: subject.tint }}>{subject.icon}</span>
        <Mascot size={140} />
        <p className="bubble">¡Muy pronto!</p>
        <button className="action" onClick={onBack}>
          <Icon name="back" /> Volver a las materias
        </button>
      </section>
    </main>
  )
}
