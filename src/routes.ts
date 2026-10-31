import { materiasInfantil } from './infantil/materias'
import { unidadesPorMateria } from './primaria/contenido'
import { materiasPrimaria } from './primaria/materias'
import type { Profile, Subject, Topic, Unit } from './types'

export type Screen =
  | { name: 'home' }
  | { name: 'icons' }
  | { name: 'trace' }
  | { name: 'subjects'; profile: Profile }
  | { name: 'subject'; profile: Profile; subject: Subject }
  | { name: 'units'; subject: Subject; units: Unit[] }
  | { name: 'topics'; subject: Subject; units: Unit[]; unit: Unit }
  | { name: 'practice'; subject: Subject; units: Unit[]; unit: Unit; topic: Topic }

const HOME: Screen = { name: 'home' }

export const subjectsOf = (profile: Profile): Subject[] =>
  profile === 'infantil' ? materiasInfantil : materiasPrimaria

// Pantalla de una materia: con unidades (Primaria) o "Muy pronto"
export function screenForSubject(profile: Profile, subject: Subject): Screen {
  const units = profile === 'primaria' ? unidadesPorMateria[subject.id] : undefined
  return units ? { name: 'units', subject, units } : { name: 'subject', profile, subject }
}

// Pantalla a la que lleva la dirección (#/primaria/matematicas/u1/...); si no existe, el inicio
export function screenFromHash(hash: string): Screen {
  const [profile, subjectId, unitId, topicId, ...rest] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (rest.length > 0) return HOME
  if (profile === undefined) return HOME
  if (profile === 'iconos') return subjectId === undefined ? { name: 'icons' } : HOME
  if (profile === 'trazo') return subjectId === undefined ? { name: 'trace' } : HOME
  if (profile !== 'infantil' && profile !== 'primaria') return HOME
  if (subjectId === undefined) return { name: 'subjects', profile }

  const subject = subjectsOf(profile).find((s) => s.id === subjectId)
  if (!subject) return HOME
  const screen = screenForSubject(profile, subject)
  if (unitId === undefined) return screen
  if (screen.name !== 'units') return HOME

  const unit = screen.units.find((u) => u.id === unitId)
  if (!unit || unit.topics.length === 0) return HOME
  if (topicId === undefined) return { name: 'topics', subject, units: screen.units, unit }

  const topic = unit.topics.find((t) => t.id === topicId)
  return topic ? { name: 'practice', subject, units: screen.units, unit, topic } : HOME
}

const PROFILE_OF_UNITS: Profile = 'primaria'

export function hashFromScreen(screen: Screen): string {
  switch (screen.name) {
    case 'home':
      return '#/'
    case 'icons':
      return '#/iconos'
    case 'trace':
      return '#/trazo'
    case 'subjects':
      return `#/${screen.profile}`
    case 'subject':
      return `#/${screen.profile}/${screen.subject.id}`
    case 'units':
      return `#/${PROFILE_OF_UNITS}/${screen.subject.id}`
    case 'topics':
      return `#/${PROFILE_OF_UNITS}/${screen.subject.id}/${screen.unit.id}`
    case 'practice':
      return `#/${PROFILE_OF_UNITS}/${screen.subject.id}/${screen.unit.id}/${screen.topic.id}`
  }
}
