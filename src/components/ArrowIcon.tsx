type ArrowIconProps = {
  direction: 'left' | 'right' | 'up' | 'down'
}

// El dibujo base apunta a la izquierda; las demás direcciones lo reflejan o lo giran
const TRANSFORMS = {
  left: undefined,
  right: 'scaleX(-1)',
  up: 'rotate(90deg)',
  down: 'rotate(-90deg)',
} as const

// Flecha dibujada en SVG: se ve igual en todos los sistemas y toma el color del texto (currentColor).
// No usar ◀ ni ▶ (ni ↑ ↓ como texto): con la fuente de emojis salen como un triángulo dentro de un cuadrado.
export function ArrowIcon({ direction }: ArrowIconProps) {
  const transform = TRANSFORMS[direction]
  return (
    <svg
      className="arrow-icon"
      data-direction={direction}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={transform ? { transform } : undefined}
    >
      <path d="M20 12H5M11.5 5.5 5 12l6.5 6.5" />
    </svg>
  )
}
