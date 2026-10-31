type Sizes = {
  textWidth: number // ancho natural del título en una sola línea
  barWidth: number // ancho útil de la barra (sin márgenes)
  sideWidth: number // ancho del lado más ancho (los botones de un lado)
  gap: number // hueco entre botones y título
}

// ¿Cabe el título, centrado, entre los botones? Se reserva el mismo espacio a cada lado
// para que quede en el centro de la barra.
export function titleFits({ textWidth, barWidth, sideWidth, gap }: Sizes): boolean {
  return textWidth <= barWidth - 2 * (sideWidth + gap)
}
