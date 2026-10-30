type MascotProps = {
  size?: number
}

// Repi, el zorro que acompaña en toda la web
export function Mascot({ size = 150 }: MascotProps) {
  return (
    <svg width={size} viewBox="0 0 120 120" role="img" aria-label="Repi, el zorro">
      <polygon points="14,10 48,34 20,62" fill="#f28c28" stroke="#4a2a0c" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="106,10 72,34 100,62" fill="#f28c28" stroke="#4a2a0c" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="20,18 38,32 24,46" fill="#ffd6a8" />
      <polygon points="100,18 82,32 96,46" fill="#ffd6a8" />
      <path d="M12 62 Q12 30 60 30 Q108 30 108 62 Q108 108 60 112 Q12 108 12 62Z" fill="#f28c28" stroke="#4a2a0c" strokeWidth="4" />
      <path d="M14 76 Q40 70 60 92 Q80 70 106 76 Q96 108 60 112 Q24 108 14 76Z" fill="#fff6e6" />
      <circle cx="42" cy="62" r="7" fill="#3a2410" />
      <circle cx="78" cy="62" r="7" fill="#3a2410" />
      <circle cx="44" cy="60" r="2.4" fill="#fff" />
      <circle cx="80" cy="60" r="2.4" fill="#fff" />
      <ellipse cx="60" cy="82" rx="8" ry="6" fill="#3a2410" />
      <path d="M48 92 Q60 102 72 92" fill="none" stroke="#3a2410" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
