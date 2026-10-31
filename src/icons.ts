// Iconos de la interfaz (botones y perfiles) con su función. Los componentes los pintan con <Icon name="..." />
// y la página #/iconos los lista: así no se escribe ningún icono a mano y no se quedan sin explicar.
//
// Las flechas son un dibujo SVG (ArrowIcon), no un carácter: ◀ y ▶ existen también como emoji y,
// con la fuente Noto Color Emoji, salían como un triángulo dentro de un cuadrado.

export type UiIcon = {
  glyph?: string // carácter o emoji
  arrow?: 'left' | 'right' // o flecha dibujada en SVG
  uso: string
  donde: string
}

export const iconosInterfaz = {
  home: { glyph: '🏠', uso: 'Volver al inicio', donde: 'Barra superior' },
  back: {
    arrow: 'left',
    uso: 'Volver atrás',
    donde: 'Barra superior · «Elegir otro tema» al terminar · «Volver a las materias»',
  },
  next: { arrow: 'right', uso: 'Pasar al siguiente ejercicio', donde: 'Botón «Siguiente» tras acertar' },
  sound: { glyph: '🔊', uso: 'Escuchar la pregunta en voz alta', donde: 'Barra superior' },
  check: { glyph: '✔', uso: 'Comprobar la respuesta y marcar el acierto', donde: 'Teclado numérico · respuesta correcta' },
  delete: { glyph: '⌫', uso: 'Borrar la última cifra', donde: 'Teclado numérico' },
  repeat: { glyph: '↻', uso: 'Repetir con ejercicios nuevos', donde: 'Pantalla final de cada tema' },
  infantil: { glyph: '🧩', uso: 'Perfil Infantil', donde: 'Pantalla de inicio' },
  primaria: { glyph: '📚', uso: 'Perfil Primaria', donde: 'Pantalla de inicio' },
} as const satisfies Record<string, UiIcon>

export type UiIconName = keyof typeof iconosInterfaz
