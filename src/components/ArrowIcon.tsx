type ArrowIconProps = {
  direction: 'left' | 'right'
}

// Flecha dibujada en SVG: se ve igual en todos los sistemas y toma el color del texto (currentColor).
// No usar ◀ ni ▶: con la fuente de emojis salen como un triángulo dentro de un cuadrado.
export function ArrowIcon({ direction }: ArrowIconProps) {
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={direction === 'right' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M20 12H5M11.5 5.5 5 12l6.5 6.5" />
    </svg>
  )
}
