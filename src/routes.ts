import { unidadesInfantil } from './infantil/contenido'
import { materiasInfantil } from './infantil/materias'
import { unidadesPorMateria as unidadesPrimaria } from './primaria/contenido'
import { materiasPrimaria } from './primaria/materias'
import type { Profile, Subject, Topic, Unit } from './types'

export type Screen =
  | { name: 'home' }
  | { name: 'icons' }
  | { name: 'trace' }
  | { name: 'voices' }
  | { name: 'subjects'; profile: Profile }
  | { name: 'subject'; profile: Profile; subject: Subject }
  | { name: 'units'; profile: Profile; subject: Subject; units: Unit[] }
  | { name: 'topics'; profile: Profile; subject: Subject; units: Unit[]; unit: Unit }
  | { name: 'practice'; profile: Profile; subject: Subject; units: Unit[]; unit: Unit; topic: Topic }

const HOME: Screen = { name: 'home' }

export const subjectsOf = (profile: Profile): Subject[] =>
  profile === 'infantil' ? materiasInfantil : materiasPrimaria

// Unidades con ejercicios de cada materia, por perfil
const unitsOf = (profile: Profile): Record<string, Unit[]> =>
  profile === 'infantil' ? unidadesInfantil : unidadesPrimaria

// Una materia tiene contenido cuando ya hay ejercicios; si no, su botón se muestra desactivado
export const hasContent = (profile: Profile, subject: Subject): boolean => unitsOf(profile)[subject.id] !== undefined

// Pantalla de una materia: en Primaria sus unidades; en Infantil, directamente sus temas (sin unidades); si no hay
// contenido, "Muy pronto"
export function screenForSubject(profile: Profile, subject: Subject): Screen {
  const units = unitsOf(profile)[subject.id]
  if (!units) return { name: 'subject', profile, subject }
  return profile === 'infantil'
    ? { name: 'topics', profile, subject, units, unit: units[0] }
    : { name: 'units', profile, subject, units }
}

// Pantalla a la que lleva la dirección (#/primaria/matematicas/u1/... o #/infantil/numeros/<tema>); si no existe, el inicio
export function screenFromHash(hash: string): Screen {
  const [profile, subjectId, unitId, topicId, ...rest] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (rest.length > 0) return HOME
  if (profile === undefined) return HOME
  if (profile === 'iconos') return subjectId === undefined ? { name: 'icons' } : HOME
  if (profile === 'trazo') return subjectId === undefined ? { name: 'trace' } : HOME
  if (profile === 'voces') return subjectId === undefined ? { name: 'voices' } : HOME
  if (profile !== 'infantil' && profile !== 'primaria') return HOME
  if (subjectId === undefined) return { name: 'subjects', profile }

  const subject = subjectsOf(profile).find((s) => s.id === subjectId)
  if (!subject) return HOME
  const screen = screenForSubject(profile, subject)
  if (unitId === undefined) return screen

  // Infantil: el tercer tramo es el tema (no hay unidades)
  if (profile === 'infantil') {
    if (screen.name !== 'topics' || topicId !== undefined) return HOME
    const topic = screen.unit.topics.find((t) => t.id === unitId)
    return topic ? { ...screen, name: 'practice', topic } : HOME
  }

  if (screen.name !== 'units') return HOME
  const unit = screen.units.find((u) => u.id === unitId)
  if (!unit || unit.topics.length === 0) return HOME
  if (topicId === undefined) return { name: 'topics', profile, subject, units: screen.units, unit }

  const topic = unit.topics.find((t) => t.id === topicId)
  return topic ? { name: 'practice', profile, subject, units: screen.units, unit, topic } : HOME
}

export function hashFromScreen(screen: Screen): string {
  switch (screen.name) {
    case 'home':
      return '#/'
    case 'icons':
      return '#/iconos'
    case 'trace':
      return '#/trazo'
    case 'voices':
      return '#/voces'
    case 'subjects':
      return `#/${screen.profile}`
    case 'subject':
      return `#/${screen.profile}/${screen.subject.id}`
    case 'units':
      return `#/${screen.profile}/${screen.subject.id}`
    case 'topics':
      return screen.profile === 'infantil'
        ? `#/infantil/${screen.subject.id}`
        : `#/${screen.profile}/${screen.subject.id}/${screen.unit.id}`
    case 'practice':
      return screen.profile === 'infantil'
        ? `#/infantil/${screen.subject.id}/${screen.topic.id}`
        : `#/${screen.profile}/${screen.subject.id}/${screen.unit.id}/${screen.topic.id}`
  }
}
