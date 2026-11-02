// Tablas de palabras con dibujo para Letras de Infantil (#86). Cada dibujo es un solo carácter y representa sin ambigüedad
// a su palabra (por eso faltan «lana», «gallina» o «zapatilla»: el dibujo podría ser otra cosa). Escritas desde cero.
export type Palabra = { emoji: string; palabra: string }

// Rimas (consonantes): las palabras de una familia acaban igual desde la vocal tónica. Ninguna familia comparte rima
// asonante con otra (los tests lo comprueban con una tabla independiente), para que una opción equivocada no «suene» a rima.
export type Rima = { terminacion: string; palabras: Palabra[] }

export const RIMAS: Rima[] = [
  {
    terminacion: 'ato',
    palabras: [
      { emoji: '🐱', palabra: 'gato' },
      { emoji: '🦆', palabra: 'pato' },
      { emoji: '👞', palabra: 'zapato' },
    ],
  },
  {
    terminacion: 'ana',
    palabras: [
      { emoji: '🐸', palabra: 'rana' },
      { emoji: '🍎', palabra: 'manzana' },
      { emoji: '🔔', palabra: 'campana' },
    ],
  },
  {
    terminacion: 'illo',
    palabras: [
      { emoji: '🔪', palabra: 'cuchillo' },
      { emoji: '🏰', palabra: 'castillo' },
      { emoji: '💍', palabra: 'anillo' },
      { emoji: '🧱', palabra: 'ladrillo' },
    ],
  },
  {
    terminacion: 'eta',
    palabras: [
      { emoji: '🧳', palabra: 'maleta' },
      { emoji: '🚲', palabra: 'bicicleta' },
      { emoji: '🍪', palabra: 'galleta' },
      { emoji: '🎺', palabra: 'trompeta' },
    ],
  },
  {
    terminacion: 'ente',
    palabras: [
      { emoji: '🐍', palabra: 'serpiente' },
      { emoji: '🦷', palabra: 'diente' },
      { emoji: '🌉', palabra: 'puente' },
      { emoji: '⛲', palabra: 'fuente' },
    ],
  },
  {
    terminacion: 'ón',
    palabras: [
      { emoji: '🐭', palabra: 'ratón' },
      { emoji: '🍈', palabra: 'melón' },
      { emoji: '🚚', palabra: 'camión' },
      { emoji: '⚽', palabra: 'balón' },
      { emoji: '🦈', palabra: 'tiburón' },
      { emoji: '🍋', palabra: 'limón' },
      { emoji: '🧼', palabra: 'jabón' },
      { emoji: '👖', palabra: 'pantalón' },
    ],
  },
  {
    terminacion: 'osa',
    palabras: [
      { emoji: '🌹', palabra: 'rosa' },
      { emoji: '🦋', palabra: 'mariposa' },
    ],
  },
  {
    terminacion: 'uga',
    palabras: [
      { emoji: '🐢', palabra: 'tortuga' },
      { emoji: '🐛', palabra: 'oruga' },
    ],
  },
]

// Sonido inicial: el sonido con el que empieza cada palabra, en castellano de España (c suave = «c», v suena como «b»,
// ge/gi = «j»). Solo consonantes; sin palabras con h, ch, ll, qu, ce/ci ni grupos como «fl» o «tr», que confunden.
export type PalabraSonido = Palabra & { sonido: string }

export const SONIDOS: PalabraSonido[] = [
  { emoji: '🐵', palabra: 'mono', sonido: 'm' },
  { emoji: '🍎', palabra: 'manzana', sonido: 'm' },
  { emoji: '🦋', palabra: 'mariposa', sonido: 'm' },
  { emoji: '🍈', palabra: 'melón', sonido: 'm' },
  { emoji: '🧳', palabra: 'maleta', sonido: 'm' },

  { emoji: '🐍', palabra: 'serpiente', sonido: 's' },
  { emoji: '🍉', palabra: 'sandía', sonido: 's' },
  { emoji: '👒', palabra: 'sombrero', sonido: 's' },
  { emoji: '🧂', palabra: 'sal', sonido: 's' },

  { emoji: '🦁', palabra: 'león', sonido: 'l' },
  { emoji: '🌙', palabra: 'luna', sonido: 'l' },
  { emoji: '🍋', palabra: 'limón', sonido: 'l' },
  { emoji: '🐺', palabra: 'lobo', sonido: 'l' },

  { emoji: '🦆', palabra: 'pato', sonido: 'p' },
  { emoji: '🐧', palabra: 'pingüino', sonido: 'p' },
  { emoji: '🍞', palabra: 'pan', sonido: 'p' },
  { emoji: '🐼', palabra: 'panda', sonido: 'p' },

  { emoji: '🐅', palabra: 'tigre', sonido: 't' },
  { emoji: '🐢', palabra: 'tortuga', sonido: 't' },
  { emoji: '🍅', palabra: 'tomate', sonido: 't' },
  { emoji: '🚂', palabra: 'tren', sonido: 't' },

  { emoji: '🦷', palabra: 'diente', sonido: 'd' },
  { emoji: '🎲', palabra: 'dado', sonido: 'd' },
  { emoji: '🐬', palabra: 'delfín', sonido: 'd' },

  { emoji: '🐭', palabra: 'ratón', sonido: 'r' },
  { emoji: '🐸', palabra: 'rana', sonido: 'r' },
  { emoji: '🌹', palabra: 'rosa', sonido: 'r' },
  { emoji: '📻', palabra: 'radio', sonido: 'r' },

  { emoji: '🍊', palabra: 'naranja', sonido: 'n' },
  { emoji: '👃', palabra: 'nariz', sonido: 'n' },
  { emoji: '🎵', palabra: 'nota', sonido: 'n' },

  { emoji: '🍓', palabra: 'fresa', sonido: 'f' },
  { emoji: '⛲', palabra: 'fuente', sonido: 'f' },
  { emoji: '🔥', palabra: 'fuego', sonido: 'f' },
  { emoji: '👻', palabra: 'fantasma', sonido: 'f' },

  { emoji: '⚽', palabra: 'balón', sonido: 'b' },
  { emoji: '🦉', palabra: 'búho', sonido: 'b' },
  { emoji: '🚲', palabra: 'bicicleta', sonido: 'b' },
  { emoji: '🍼', palabra: 'biberón', sonido: 'b' },

  { emoji: '🐴', palabra: 'caballo', sonido: 'c' },
  { emoji: '🏠', palabra: 'casa', sonido: 'c' },
  { emoji: '🐪', palabra: 'camello', sonido: 'c' },
  { emoji: '🚚', palabra: 'camión', sonido: 'c' },

  { emoji: '🐱', palabra: 'gato', sonido: 'g' },
  { emoji: '🎸', palabra: 'guitarra', sonido: 'g' },
  { emoji: '🦍', palabra: 'gorila', sonido: 'g' },

  { emoji: '🦒', palabra: 'jirafa', sonido: 'j' },
  { emoji: '🧼', palabra: 'jabón', sonido: 'j' },
  { emoji: '🐗', palabra: 'jabalí', sonido: 'j' },
]
