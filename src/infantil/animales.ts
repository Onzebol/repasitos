// Animales para contar (un solo carácter cada uno, para poder dibujar un grupo y contarlos), con su plural y su
// género para formular la pregunta: «¿Cuántos perros hay?», «¿Cuántas ranas hay?».
export type Animal = { emoji: string; plural: string; fem?: boolean }

export const ANIMALES: Animal[] = [
  { emoji: '🐘', plural: 'elefantes' },
  { emoji: '🐢', plural: 'tortugas', fem: true },
  { emoji: '🐰', plural: 'conejos' },
  { emoji: '🐸', plural: 'ranas', fem: true },
  { emoji: '🐱', plural: 'gatos' },
  { emoji: '🐶', plural: 'perros' },
  { emoji: '🐟', plural: 'peces' },
  { emoji: '🐧', plural: 'pingüinos' },
  { emoji: '🐮', plural: 'vacas', fem: true },
  { emoji: '🐷', plural: 'cerdos' },
  { emoji: '🦁', plural: 'leones' },
  { emoji: '🐵', plural: 'monos' },
  { emoji: '🐻', plural: 'osos' },
  { emoji: '🦊', plural: 'zorros' },
]
