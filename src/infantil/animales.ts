// Animales para contar (un solo carácter cada uno, para poder dibujar un grupo y contarlos), con su nombre en singular
// y plural y su género para formular preguntas y etiquetas: «¿Cuántos perros hay?», «¿Cuántas ranas hay?», «1 perro».
export type Animal = { emoji: string; singular: string; plural: string; fem?: boolean }

export const ANIMALES: Animal[] = [
  { emoji: '🐘', singular: 'elefante', plural: 'elefantes' },
  { emoji: '🐢', singular: 'tortuga', plural: 'tortugas', fem: true },
  { emoji: '🐰', singular: 'conejo', plural: 'conejos' },
  { emoji: '🐸', singular: 'rana', plural: 'ranas', fem: true },
  { emoji: '🐱', singular: 'gato', plural: 'gatos' },
  { emoji: '🐶', singular: 'perro', plural: 'perros' },
  { emoji: '🐟', singular: 'pez', plural: 'peces' },
  { emoji: '🐧', singular: 'pingüino', plural: 'pingüinos' },
  { emoji: '🐮', singular: 'vaca', plural: 'vacas', fem: true },
  { emoji: '🐷', singular: 'cerdo', plural: 'cerdos' },
  { emoji: '🦁', singular: 'león', plural: 'leones' },
  { emoji: '🐵', singular: 'mono', plural: 'monos' },
  { emoji: '🐻', singular: 'oso', plural: 'osos' },
  { emoji: '🦊', singular: 'zorro', plural: 'zorros' },
]
