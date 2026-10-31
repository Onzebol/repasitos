// Los iconos que la web sabe dibujar: los caracteres de la fuente Noto Color Emoji que lleva dentro
// (src/assets/emoji-font.css). Se leen de sus rangos `unicode-range`, sin dependencias ni lista a mano.

// "U+30-32,U+a9" → [0x30, 0x31, 0x32, 0xa9]
export function parseUnicodeRange(range: string): number[] {
  const points: number[] = []
  for (const part of range.split(',')) {
    const match = /U\+([0-9a-f]+)(?:-([0-9a-f]+))?/i.exec(part.trim())
    if (!match) continue
    const first = parseInt(match[1], 16)
    const last = match[2] ? parseInt(match[2], 16) : first
    for (let point = first; point <= last; point++) points.push(point)
  }
  return points
}

// Emojis de un solo carácter que cubre la fuente, sin repetir y por orden de código.
// Quedan fuera cifras, almohadilla, ©, ®, uniones (ZWJ), selectores y marcas de banderas, que no son iconos por sí solos.
export function emojisDeLaFuente(css: string): string[] {
  const points = new Set<number>()
  for (const [, range] of css.matchAll(/unicode-range:\s*([^;]+);/g)) {
    for (const point of parseUnicodeRange(range)) points.add(point)
  }
  return [...points]
    .filter((point) => point > 0xff)
    .sort((a, b) => a - b)
    .map((point) => String.fromCodePoint(point))
    .filter((emoji) => /\p{Extended_Pictographic}/u.test(emoji))
}

// Bloques aproximados de Unicode (no por tema): sirven para no mostrar mil iconos de golpe
const CATEGORIAS: [number, number, string][] = [
  [0x1f300, 0x1f32f, 'Cielo y clima'],
  [0x1f330, 0x1f37f, 'Plantas y comida'],
  [0x1f380, 0x1f3df, 'Fiestas y deportes'],
  [0x1f3e0, 0x1f3ff, 'Edificios y banderas'],
  [0x1f400, 0x1f43f, 'Animales'],
  [0x1f440, 0x1f4ff, 'Cuerpo y objetos'],
  [0x1f500, 0x1f5ff, 'Símbolos y objetos'],
  [0x1f600, 0x1f64f, 'Caras y gestos'],
  [0x1f680, 0x1f6ff, 'Transporte y mapas'],
  [0x1f900, 0x1f9ff, 'Más caras, animales, comida y objetos'],
  [0x1fa70, 0x1faff, 'Más objetos y animales'],
]

export const OTROS = 'Otros símbolos'

export function categoriaDe(emoji: string): string {
  const point = emoji.codePointAt(0) ?? 0
  return CATEGORIAS.find(([from, to]) => point >= from && point <= to)?.[2] ?? OTROS
}
