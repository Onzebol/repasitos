import type { FactItem, Group, Member, PairRow, Topic } from '../../types'

// Unidad 2: «¿Qué sabes sobre los animales?» (ver docs/lengua-2-primaria.md). Mismas reglas que la unidad 1: ejercicios
// escritos desde cero con el vocabulario y las reglas de la unidad, preguntas generadas desde tablas y respuestas
// equivocadas que son falsas seguro. Las lecturas del libro no se usan: los textos de comprensión lectora son propios.
// Cada bloque tiene al menos el doble de hechos distintos que los que toma una sesión.

const miembro = (label: string, group: string, emoji?: string): Member => ({ label, group, ...(emoji ? { emoji } : {}) })

// ── Palabras de la granja ──────────────────────────────────────────────────────────────────────────────────────────────
// Dónde vive cada animal. Un solo lugar por animal y ninguno sirve para otro de la tabla (por eso no están juntos la cuadra
// y el establo, que también puede ser de caballos: el establo y el corral van como hechos sueltos).
const vive = (animal: string, lugar: string): PairRow => ({
  ask: `¿Dónde vive ${animal} en la granja?`,
  answer: lugar,
  askBack: `¿Qué animal vive en ${lugar}?`,
  answerBack: animal,
})
const LUGARES: PairRow[] = [
  vive('el caballo', 'la cuadra'),
  vive('el cerdo', 'la pocilga'),
  vive('la gallina', 'el gallinero'),
  vive('la oveja', 'el redil'),
  vive('el conejo', 'la conejera'),
  vive('la abeja', 'la colmena'),
  vive('la paloma', 'el palomar'),
  vive('el perro', 'la caseta'),
]

const DOMESTICOS: Group[] = [
  { id: 'domestico', label: 'doméstico', question: '¿Cuál de estos animales es doméstico?' },
  { id: 'salvaje', label: 'salvaje', question: '¿Cuál de estos animales es salvaje?' },
]
const ANIMALES: Member[] = [
  miembro('el perro', 'domestico', '🐕'),
  miembro('el gato', 'domestico', '🐈'),
  miembro('la vaca', 'domestico', '🐄'),
  miembro('la oveja', 'domestico', '🐑'),
  miembro('la gallina', 'domestico', '🐔'),
  miembro('el caballo', 'domestico', '🐎'),
  miembro('el cerdo', 'domestico', '🐖'),
  miembro('el león', 'salvaje', '🦁'),
  miembro('el lobo', 'salvaje', '🐺'),
  miembro('el tigre', 'salvaje', '🐅'),
  miembro('la jirafa', 'salvaje', '🦒'),
  miembro('el elefante', 'salvaje', '🐘'),
  miembro('el cocodrilo', 'salvaje', '🐊'),
  miembro('la cebra', 'salvaje', '🦓'),
]

const GRANJA: FactItem[] = [
  {
    question: '¿Cómo se llama el sitio cubierto donde duermen las vacas?',
    answer: 'el establo',
    wrong: ['la colmena', 'el palomar', 'la pecera'],
  },
  {
    question: '¿Cómo se llama el sitio cerrado y al aire libre donde andan los animales de la granja?',
    answer: 'el corral',
    wrong: ['la colmena', 'la pecera', 'el nido'],
  },
  {
    question: '¿Qué es un animal doméstico?',
    answer: 'un animal que vive con las personas y lo cuidan',
    wrong: ['un animal que vive libre en la selva', 'un animal que solo vive en el mar', 'un animal de juguete'],
  },
  {
    question: '¿Qué es un animal salvaje?',
    answer: 'un animal que vive libre en la naturaleza',
    wrong: ['un animal que vive en casa con las personas', 'un animal de juguete', 'un animal que duerme en una cesta'],
  },
  { question: '¿Cómo se llaman todos los animales que viven en un lugar?', answer: 'la fauna', wrong: ['la flora', 'la granja', 'el corral'] },
  {
    question: '¿Quién cuida la salud de los animales?',
    answer: 'el veterinario o la veterinaria',
    wrong: ['el cartero o la cartera', 'el panadero o la panadera', 'el bombero o la bombera'],
  },
  {
    question: '¿Quién se ocupa de los animales y del trabajo de la granja?',
    answer: 'el granjero o la granjera',
    wrong: ['el pescador o la pescadora', 'el piloto o la piloto', 'el dentista o la dentista'],
  },
  {
    question: '¿Quién cuida de las ovejas en el campo?',
    answer: 'el pastor o la pastora',
    wrong: ['el cocinero o la cocinera', 'el pintor o la pintora', 'el cartero o la cartera'],
  },
  { question: '¿Qué animal de la granja nos da lana?', answer: 'la oveja', wrong: ['la gallina', 'el cerdo', 'la vaca'] },
  { question: '¿Qué animal de la granja pone huevos?', answer: 'la gallina', wrong: ['la vaca', 'la oveja', 'el caballo'] },
  { question: '¿Qué animal de la granja nos da leche?', answer: 'la vaca', wrong: ['la gallina', 'el cerdo', 'la paloma'] },
]

// ── Antónimos ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Palabras de significado contrario, preguntadas en los dos sentidos. Ninguna palabra tiene otro contrario en la misma tabla
// (no están «alto» ni «viejo», que tienen dos) y ninguna se repite entre tablas.
const contrario = (a: string, b: string): PairRow => ({
  ask: `¿Cuál es el contrario de «${a}»?`,
  answer: b,
  askBack: `¿Cuál es el contrario de «${b}»?`,
  answerBack: a,
})
const ADJETIVOS: PairRow[] = [
  contrario('grande', 'pequeño'),
  contrario('alegre', 'triste'),
  contrario('gordo', 'delgado'),
  contrario('lleno', 'vacío'),
  contrario('duro', 'blando'),
  contrario('rápido', 'lento'),
  contrario('limpio', 'sucio'),
  contrario('largo', 'corto'),
  contrario('mojado', 'seco'),
  contrario('frío', 'caliente'),
]
const VERBOS: PairRow[] = [
  contrario('empezar', 'acabar'),
  contrario('subir', 'bajar'),
  contrario('abrir', 'cerrar'),
  contrario('ganar', 'perder'),
  contrario('entrar', 'salir'),
  contrario('encender', 'apagar'),
  contrario('reír', 'llorar'),
  contrario('meter', 'sacar'),
  contrario('recordar', 'olvidar'),
  contrario('comprar', 'vender'),
]
// Contrarios que se forman poniendo in- delante (im- delante de p o b)
const CON_IN: PairRow[] = [
  contrario('feliz', 'infeliz'),
  contrario('útil', 'inútil'),
  contrario('cómodo', 'incómodo'),
  contrario('justo', 'injusto'),
  contrario('visible', 'invisible'),
  contrario('capaz', 'incapaz'),
  contrario('posible', 'imposible'),
  contrario('paciente', 'impaciente'),
]

const oracionContraria = (original: string, buena: string, malas: string[]): FactItem => ({
  question: `¿Qué oración dice lo contrario de «${original}»?`,
  answer: buena,
  wrong: malas,
})
const ANTONIMOS: FactItem[] = [
  {
    question: '¿Cómo se llaman las palabras que significan lo contrario?',
    answer: 'antónimos',
    wrong: ['sinónimos', 'rimas', 'sílabas'],
  },
  { question: '¿Qué pareja de palabras son antónimos?', answer: 'día y noche', wrong: ['casa y hogar', 'gato y pato', 'mesa y silla'] },
  { question: '¿Qué pareja de palabras son sinónimos?', answer: 'contento y alegre', wrong: ['alto y bajo', 'día y noche', 'subir y bajar'] },
  oracionContraria('La caja está llena', 'La caja está vacía.', ['La caja está repleta.', 'La caja está cerrada.', 'La mesa está llena.']),
  oracionContraria('El tren es rápido', 'El tren es lento.', ['El tren es veloz.', 'El tren es largo.', 'El coche es rápido.']),
  oracionContraria('Mi hermano gana el partido', 'Mi hermano pierde el partido.', [
    'Mi hermano juega el partido.',
    'Mi hermano ve el partido.',
    'Mi hermana gana el partido.',
  ]),
  oracionContraria('La puerta está abierta', 'La puerta está cerrada.', ['La puerta está pintada.', 'La puerta es grande.', 'La ventana está abierta.']),
  oracionContraria('El agua está fría', 'El agua está caliente.', ['El agua está helada.', 'El agua está limpia.', 'La leche está fría.']),
]

// ── La r y la rr ───────────────────────────────────────────────────────────────────────────────────────────────────────
// Regla del libro: el sonido R suave se escribe con una r (toro); el fuerte, con r (reno) o con rr (perro), y la rr solo va
// entre vocales. Cada palabra tiene una sola R y no hay ninguna con r detrás de n, l o s (el libro no las explica).
const SONIDOS_R: Group[] = [
  { id: 'suave', label: 'suave, con una r' },
  { id: 'fuerte-r', label: 'fuerte, con una r' },
  { id: 'fuerte-rr', label: 'fuerte, con rr' },
]
const PALABRAS_R: Member[] = [
  ...['toro', 'mariposa', 'loro', 'caracol', 'gorila', 'oreja', 'araña', 'erizo', 'canario', 'jirafa'].map((p) => miembro(p, 'suave')),
  ...['reno', 'ratón', 'rana', 'rosa', 'rueda', 'regalo', 'rojo', 'río', 'rubio', 'ropa'].map((p) => miembro(p, 'fuerte-r')),
  ...['perro', 'zorro', 'gorrión', 'burro', 'torre', 'tierra', 'cotorra', 'guitarra', 'barro'].map((p) => miembro(p, 'fuerte-rr')),
]

// Frases con una sola forma bien escrita: las malas cambian una r por rr o al revés. Todas empiezan por mayúscula.
const fraseR = (sobre: string, buena: string, malas: string[]): FactItem => ({
  question: `¿Qué frase está bien escrita sobre ${sobre}?`,
  answer: buena,
  wrong: malas,
})
const FRASES_R: FactItem[] = [
  fraseR('un perro', 'El perro corre por el parque.', ['El pero corre por el parque.', 'El perro core por el parque.', 'El perro corre por el parrque.']),
  fraseR('un ratón', 'El ratón se esconde en la torre.', [
    'El rratón se esconde en la torre.',
    'El ratón se esconde en la tore.',
    'El rratón se esconde en la tore.',
  ]),
  fraseR('una rana', 'La rana salta en el barro.', ['La rrana salta en el barro.', 'La rana salta en el baro.', 'La rrana salta en el baro.']),
  fraseR('un loro', 'El loro de Rosa habla mucho.', [
    'El lorro de Rosa habla mucho.',
    'El loro de Rrosa habla mucho.',
    'El lorro de Rrosa habla mucho.',
  ]),
  fraseR('un burro', 'El burro lleva una carga.', ['El buro lleva una carga.', 'El burro lleva una carrga.', 'El buro lleva una carrga.']),
  fraseR('una guitarra', 'Mi tío toca la guitarra roja.', [
    'Mi tío toca la guitara roja.',
    'Mi tío toca la guitarra rroja.',
    'Mi tío toca la guitara rroja.',
  ]),
  fraseR('una mariposa', 'Una mariposa vuela sobre la rosa.', [
    'Una marriposa vuela sobre la rosa.',
    'Una mariposa vuela sobre la rrosa.',
    'Una marriposa vuela sobre la rrosa.',
  ]),
  fraseR('un zorro', 'El zorro duerme en su cueva.', [
    'El zoro duerme en su cueva.',
    'El zorro duerrme en su cueva.',
    'El zoro duerrme en su cueva.',
  ]),
]

// Palabras que cambian de significado con r o con rr (las equivocadas son las otras de la tabla, también su pareja)
const significa = (palabra: string, definicion: string): PairRow => ({
  ask: `¿Qué palabra significa «${definicion}»?`,
  answer: palabra,
  askBack: `¿Qué significa «${palabra}»?`,
  answerBack: definicion,
})
const PAREJAS_R: PairRow[] = [
  significa('caro', 'que cuesta mucho dinero'),
  significa('carro', 'vehículo con ruedas del que tira un animal'),
  significa('pera', 'fruta verde o amarilla'),
  significa('perra', 'la hembra del perro'),
  significa('coro', 'grupo de personas que cantan juntas'),
  significa('corro', 'círculo de personas cogidas de la mano'),
  significa('cero', 'el número 0'),
  significa('cerro', 'monte pequeño'),
  significa('coral', 'animal del mar que forma rocas de colores'),
  significa('corral', 'sitio cerrado donde están los animales de la granja'),
]

// ── Unir oraciones ─────────────────────────────────────────────────────────────────────────────────────────────────────
// Dos oraciones que cuentan cosas de lo mismo se unen con «y» sin repetir. Las malas repiten, se olvidan de la «y» o
// cambian lo que se cuenta.
const unir = (a: string, b: string, buena: string, malas: string[]): FactItem => ({
  question: `¿Cómo se unen «${a}» y «${b}» en una sola oración, sin repetir palabras?`,
  answer: buena,
  wrong: malas,
})
const UNIR: FactItem[] = [
  unir('Marta come pan.', 'Marta come queso.', 'Marta come pan y queso.', [
    'Marta come pan y Marta come queso.',
    'Marta come pan queso.',
    'Marta come pan y leche.',
  ]),
  unir('El perro salta.', 'El perro corre.', 'El perro salta y corre.', ['El perro salta y el perro corre.', 'El perro salta corre.', 'El gato salta y corre.']),
  unir('Luis canta.', 'Ana canta.', 'Luis y Ana cantan.', ['Luis canta y Ana canta.', 'Luis Ana cantan.', 'Luis y Ana bailan.']),
  unir('En la granja hay vacas.', 'En la granja hay ovejas.', 'En la granja hay vacas y ovejas.', [
    'En la granja hay vacas y en la granja hay ovejas.',
    'En la granja hay vacas ovejas.',
    'En la granja hay vacas y cerdos.',
  ]),
  unir('La gallina pone huevos.', 'La gallina come maíz.', 'La gallina pone huevos y come maíz.', [
    'La gallina pone huevos y la gallina come maíz.',
    'La gallina pone huevos come maíz.',
    'La gallina pone huevos y come trigo.',
  ]),
  unir('Pedro tiene un gato.', 'Pedro tiene un pez.', 'Pedro tiene un gato y un pez.', [
    'Pedro tiene un gato y Pedro tiene un pez.',
    'Pedro tiene un gato un pez.',
    'Pedro tiene un gato y un perro.',
  ]),
  unir('Lola pinta.', 'Lola dibuja.', 'Lola pinta y dibuja.', ['Lola pinta y Lola dibuja.', 'Lola pinta dibuja.', 'Lola pinta y canta.']),
  unir('El caballo es grande.', 'El caballo es fuerte.', 'El caballo es grande y fuerte.', [
    'El caballo es grande y el caballo es fuerte.',
    'El caballo es grande fuerte.',
    'El caballo es grande y lento.',
  ]),
  unir('Mi abuelo planta tomates.', 'Mi abuelo planta lechugas.', 'Mi abuelo planta tomates y lechugas.', [
    'Mi abuelo planta tomates y mi abuelo planta lechugas.',
    'Mi abuelo planta tomates lechugas.',
    'Mi abuelo planta tomates y patatas.',
  ]),
  unir('El pato nada.', 'La oca nada.', 'El pato y la oca nadan.', ['El pato nada y la oca nada.', 'El pato la oca nadan.', 'El pato y la oca vuelan.']),
  unir('Hoy llueve.', 'Hoy hace frío.', 'Hoy llueve y hace frío.', ['Hoy llueve y hoy hace frío.', 'Hoy llueve hace frío.', 'Hoy llueve y hace calor.']),
  unir('Sara lee un cuento.', 'Sara lee un cómic.', 'Sara lee un cuento y un cómic.', [
    'Sara lee un cuento y Sara lee un cómic.',
    'Sara lee un cuento un cómic.',
    'Sara lee un cuento y un libro.',
  ]),
  unir('La vaca come hierba.', 'La oveja come hierba.', 'La vaca y la oveja comen hierba.', [
    'La vaca come hierba y la oveja come hierba.',
    'La vaca la oveja comen hierba.',
    'La vaca y la oveja comen maíz.',
  ]),
]

// Separar las palabras de una oración escrita toda junta: todas las opciones tienen las mismas letras
const separar = (junta: string, buena: string, malas: string[]): FactItem => ({
  question: `¿Cómo se separan bien las palabras de «${junta}»?`,
  answer: buena,
  wrong: malas,
})
const SEPARAR: FactItem[] = [
  separar('Elgatoduerme.', 'El gato duerme.', ['Elgato duerme.', 'El ga to duerme.', 'El gatoduer me.']),
  separar('Lavacadaleche.', 'La vaca da leche.', ['La vacada leche.', 'Lava ca da leche.', 'La vaca dale che.']),
  separar('Mipatonada.', 'Mi pato nada.', ['Mipato nada.', 'Mi pa tonada.', 'Mi patona da.']),
  separar('Elperroladra.', 'El perro ladra.', ['Elperro ladra.', 'El pe rroladra.', 'El perrola dra.']),
  separar('Lagallinaponehuevos.', 'La gallina pone huevos.', ['Laga llina pone huevos.', 'La gallinapone huevos.', 'La gallina po nehuevos.']),
  separar('Hoyhacesol.', 'Hoy hace sol.', ['Hoyhace sol.', 'Hoy ha cesol.', 'Ho yhace sol.']),
  separar('Elcaballocorre.', 'El caballo corre.', ['Elcaballo corre.', 'El caba llocorre.', 'El caballocor re.']),
  separar('Laovejatienelana.', 'La oveja tiene lana.', ['Laoveja tiene lana.', 'La ove jatiene lana.', 'La oveja tienela na.']),
  separar('Mesientoenlasilla.', 'Me siento en la silla.', ['Mesiento en la silla.', 'Me sien toen la silla.', 'Me siento enla silla.']),
]

// ── La lengua oral y la escrita ────────────────────────────────────────────────────────────────────────────────────────
// Acciones del colegio y de casa que son, sin duda, hablar o escribir (nada de «leer en voz alta» ni «mensajes de voz»)
const LENGUAS: Group[] = [
  { id: 'oral', label: 'lengua oral', question: '¿Cuál de estas acciones es lengua oral?' },
  { id: 'escrita', label: 'lengua escrita', question: '¿Cuál de estas acciones es lengua escrita?' },
]
const ACCIONES: Member[] = [
  ...[
    'contar un cuento',
    'hablar por teléfono',
    'saludar a un amigo',
    'preguntar algo a la maestra',
    'contar lo que pasó en el recreo',
    'cantar una canción',
    'explicar un juego a los compañeros',
  ].map((a) => miembro(a, 'oral')),
  ...[
    'escribir la fecha en la pizarra',
    'escribir una carta',
    'escribir un mensaje en el chat',
    'hacer la lista de la compra',
    'escribir un resumen',
    'rellenar una ficha',
    'mandar una postal',
  ].map((a) => miembro(a, 'escrita')),
]

const ORAL_ESCRITA: FactItem[] = [
  {
    question: '¿Cuál es el principal medio de comunicación entre las personas?',
    answer: 'el lenguaje',
    wrong: ['los colores', 'los números', 'los juguetes'],
  },
  { question: 'Cuando hablamos, ¿qué usamos?', answer: 'la lengua oral', wrong: ['la lengua escrita', 'el braille', 'los pictogramas'] },
  { question: 'Cuando escribimos, ¿qué usamos?', answer: 'la lengua escrita', wrong: ['la lengua oral', 'la lengua de signos', 'los gestos'] },
  { question: 'Una conversación entre amigos, ¿qué es?', answer: 'lengua oral', wrong: ['lengua escrita', 'braille', 'un pictograma'] },
  { question: 'Un mensaje escrito en el chat, ¿qué es?', answer: 'lengua escrita', wrong: ['lengua oral', 'lengua de signos', 'un pictograma'] },
  {
    question: '¿Con qué se comunican muchas personas sordas?',
    answer: 'con la lengua de signos',
    wrong: ['con el braille', 'con un silbato', 'con la radio'],
  },
  {
    question: '¿Qué es la lengua de signos?',
    answer: 'una lengua que se hace con las manos y la cara',
    wrong: ['una lengua que se lee con los dedos', 'una lengua de dibujos en las calles', 'una lengua que solo se canta'],
  },
  {
    question: '¿Con qué leen muchas personas ciegas?',
    answer: 'con el braille',
    wrong: ['con la lengua de signos', 'con pictogramas', 'con gafas de sol'],
  },
  {
    question: '¿Cómo se lee el braille?',
    answer: 'tocando puntos en relieve con los dedos',
    wrong: ['mirando dibujos de colores', 'escuchando la radio', 'moviendo las manos'],
  },
  {
    question: '¿Qué es un pictograma?',
    answer: 'un dibujo sencillo que da una información',
    wrong: ['una letra muy grande', 'un número de teléfono', 'una canción corta'],
  },
  {
    question: '¿Para qué sirven los pictogramas?',
    answer: 'para comunicarse con dibujos',
    wrong: ['para medir cosas', 'para contar dinero', 'para hacer música'],
  },
  {
    question: 'Un pictograma con notas musicales, ¿qué asignatura indica?',
    answer: 'Música',
    wrong: ['Matemáticas', 'Lengua', 'Educación Física'],
    visual: '🎼',
  },
  {
    question: 'Un pictograma con los números 1, 2 y 3, ¿qué asignatura indica?',
    answer: 'Matemáticas',
    wrong: ['Música', 'Lengua', 'Educación Física'],
    visual: '🔢',
  },
]

// ── Símbolos y cómic ───────────────────────────────────────────────────────────────────────────────────────────────────
// Símbolos informativos con un significado único (solo los que dibuja la fuente de la web)
const simbolo = (emoji: string, significado: string): PairRow => ({
  ask: `¿Qué significa el símbolo ${emoji}?`,
  answer: significado,
  askBack: `¿Qué símbolo significa «${significado}»?`,
  answerBack: emoji,
})
const SIMBOLOS: PairRow[] = [
  simbolo('🚻', 'aseos'),
  simbolo('♿', 'sitio preparado para sillas de ruedas'),
  simbolo('🚭', 'prohibido fumar'),
  simbolo('♻️', 'reciclar'),
  simbolo('🚰', 'agua para beber'),
  simbolo('🅿️', 'aparcamiento'),
  simbolo('⚠️', 'cuidado, peligro'),
  simbolo('📵', 'prohibido usar el móvil'),
  simbolo('🚯', 'no tirar basura'),
  simbolo('ℹ️', 'información'),
]

const SOBRE_SIMBOLOS: FactItem[] = [
  {
    question: '¿Qué son los símbolos informativos?',
    answer: 'dibujos sencillos que nos dan información',
    wrong: ['letras muy grandes', 'cuadros de un museo', 'fotos de personas'],
  },
  {
    question: '¿Dónde podemos encontrar símbolos informativos?',
    answer: 'en las calles, los edificios y los planos',
    wrong: ['solo en los cuentos', 'solo dentro de la nevera', 'solo en las canciones'],
  },
  {
    question: '¿Para qué sirve la leyenda de un plano?',
    answer: 'para saber qué significa cada símbolo',
    wrong: ['para contar un cuento', 'para pintar el plano', 'para medir la temperatura'],
  },
  {
    question: '¿Dónde hay símbolos que dicen cómo lavar una prenda?',
    answer: 'en la etiqueta de la ropa',
    wrong: ['en la tapa de un yogur', 'en un semáforo', 'en una moneda'],
  },
  {
    question: '¿Por qué los símbolos son dibujos sencillos?',
    answer: 'para entenderlos de un vistazo',
    wrong: ['para que cueste entenderlos', 'para colorearlos', 'porque son muy antiguos'],
  },
  {
    question: 'Un símbolo tachado con una raya roja, ¿qué suele decir?',
    answer: 'que algo está prohibido',
    wrong: ['que algo es gratis', 'que algo es nuevo', 'que hay que correr'],
  },
]

const COMIC: FactItem[] = [
  {
    question: '¿Cómo se llama cada uno de los cuadros de un cómic?',
    answer: 'la viñeta',
    wrong: ['el bocadillo', 'la portada', 'el índice'],
  },
  {
    question: '¿Dónde va lo que dicen los personajes de un cómic?',
    answer: 'dentro de los bocadillos',
    wrong: ['debajo de la página', 'en la portada', 'en el índice'],
  },
  {
    question: '¿Qué bocadillo se usa cuando un personaje habla?',
    answer: 'el bocadillo con pico',
    wrong: ['el bocadillo con forma de nube', 'la portada', 'el título'],
  },
  {
    question: '¿Qué bocadillo se usa cuando un personaje piensa?',
    answer: 'el bocadillo con forma de nube',
    wrong: ['el bocadillo con pico', 'la portada', 'el título'],
  },
  {
    question: '¿Qué va en la parte de arriba de algunas viñetas?',
    answer: 'unas líneas que ayudan a entender la historia',
    wrong: ['lo que piensa el personaje', 'el número de la página', 'el precio del cómic'],
  },
  {
    question: '¿Qué es un cómic?',
    answer: 'una historia contada con viñetas y dibujos',
    wrong: ['una canción con rima', 'un libro sin dibujos', 'un plano con símbolos'],
  },
]

// ── Comprensión lectora ────────────────────────────────────────────────────────────────────────────────────────────────
// Textos propios y cortos: tres cuentos y tres textos informativos sobre animales. Cada pregunta se contesta con una frase
// del texto y las equivocadas dicen otra cosa.
const CABRA =
  'La cabra Canela se escapó del corral por la mañana. Leo la buscó por el huerto y por el camino del río. Al final la encontró debajo de un manzano, comiendo hierba fresca. Leo la llevó de vuelta y cerró bien la puerta.'
const PATITOS =
  'Mamá pata tenía cinco patitos amarillos. Un día los llevó a la charca por primera vez. Cuatro patitos se metieron en el agua enseguida, pero el más pequeño tenía miedo. Su mamá nadó a su lado y, al final, el patito se atrevió y chapoteó feliz.'
const OVEJA =
  'La oveja Nieve tiene la lana muy blanca y muy larga. En verano tiene mucho calor, así que el granjero le corta la lana. Con esa lana, la abuela teje bufandas y gorros para el invierno. Nieve queda más fresca y corre feliz por el prado.'
const ABEJAS =
  'Las abejas son insectos que viven en grupo dentro de una colmena. Vuelan de flor en flor para recoger néctar, un líquido dulce de las flores. Con el néctar fabrican la miel. En cada colmena hay una sola reina, que es la que pone los huevos.'
const GALLINAS =
  'Las gallinas son aves. Tienen plumas, pico y dos patas, y casi no vuelan. Viven en el gallinero y por la noche duermen subidas a un palo. Las gallinas ponen huevos. De algunos huevos nacen los pollitos.'
const VACAS =
  'Las vacas son mamíferos. Comen hierba en el prado y, cuando hace frío, duermen en el establo. Las vacas nos dan leche. Con la leche se hacen el queso, el yogur y la mantequilla.'

const leer = (text: string, question: string, answer: string, wrong: string[]): FactItem => ({ text, question, answer, wrong })
const LECTURAS: FactItem[] = [
  leer(CABRA, '¿De dónde se escapó la cabra Canela?', 'del corral', ['del huerto', 'de la casa', 'del colegio']),
  leer(CABRA, '¿Dónde encontró Leo a la cabra?', 'debajo de un manzano', ['en el río', 'dentro de la casa', 'encima de un tejado']),
  leer(CABRA, '¿Qué estaba haciendo Canela cuando Leo la encontró?', 'comiendo hierba fresca', ['durmiendo', 'bebiendo agua', 'jugando con un perro']),
  leer(CABRA, '¿Qué hizo Leo al final?', 'cerró bien la puerta', ['se fue a dormir', 'abrió la puerta', 'se comió una manzana']),
  leer(PATITOS, '¿Cuántos patitos tenía mamá pata?', 'cinco', ['cuatro', 'tres', 'seis']),
  leer(PATITOS, '¿Adónde llevó mamá pata a los patitos?', 'a la charca', ['al río', 'al mar', 'al corral']),
  leer(PATITOS, '¿Por qué el patito más pequeño no se metía en el agua?', 'porque tenía miedo', [
    'porque tenía frío',
    'porque tenía hambre',
    'porque estaba dormido',
  ]),
  leer(PATITOS, '¿Qué hizo mamá pata para ayudar al patito?', 'nadó a su lado', ['lo empujó al agua', 'le dio de comer', 'se fue a casa']),
  leer(OVEJA, '¿Cómo es la lana de Nieve?', 'blanca y larga', ['negra y corta', 'marrón y rizada', 'gris y corta']),
  leer(OVEJA, '¿Cuándo le cortan la lana a Nieve?', 'en verano', ['en invierno', 'en otoño', 'por la noche']),
  leer(OVEJA, '¿Qué teje la abuela con la lana?', 'bufandas y gorros', ['calcetines y guantes', 'mantas y cojines', 'jerséis y faldas']),
  leer(OVEJA, '¿Cómo queda Nieve sin tanta lana?', 'más fresca', ['más triste', 'con frío', 'más cansada']),
  leer(ABEJAS, '¿De qué trata el texto de las abejas?', 'de cómo viven las abejas', [
    'de cómo se planta una flor',
    'de un viaje en barco',
    'de cómo se hace el pan',
  ]),
  leer(ABEJAS, '¿Dónde viven las abejas?', 'en una colmena', ['en un establo', 'en una pecera', 'en una cueva']),
  leer(ABEJAS, '¿Qué fabrican las abejas con el néctar?', 'la miel', ['la leche', 'el queso', 'el pan']),
  leer(ABEJAS, '¿Quién pone los huevos en la colmena?', 'la reina', ['todas las abejas', 'las flores', 'el granjero']),
  leer(GALLINAS, '¿Qué animales son las gallinas?', 'aves', ['mamíferos', 'peces', 'insectos']),
  leer(GALLINAS, '¿Cuántas patas tienen las gallinas?', 'dos', ['cuatro', 'seis', 'ninguna']),
  leer(GALLINAS, '¿Dónde duermen las gallinas por la noche?', 'subidas a un palo', [
    'dentro del agua',
    'en lo alto de un árbol',
    'en la casa del granjero',
  ]),
  leer(GALLINAS, '¿Qué nace de algunos huevos de gallina?', 'los pollitos', ['los gatitos', 'los corderos', 'las flores']),
  leer(VACAS, '¿Qué tipo de animales son las vacas?', 'mamíferos', ['aves', 'peces', 'insectos']),
  leer(VACAS, '¿Qué comen las vacas en el prado?', 'hierba', ['carne', 'peces', 'chocolate']),
  leer(VACAS, '¿Dónde duermen las vacas cuando hace frío?', 'en el establo', ['en la colmena', 'en el palomar', 'en el río']),
  leer(VACAS, '¿Qué se hace con la leche de vaca?', 'queso, yogur y mantequilla', ['zumo y mermelada', 'pan y aceite', 'miel y huevos']),
]

export const temasUnidad2: Topic[] = [
  {
    id: 'granja',
    name: 'Palabras de la granja',
    icon: '🐓',
    tint: '#ffe9a8',
    plan: [
      { spec: { kind: 'pairs', rows: LUGARES }, count: 3 },
      { spec: { kind: 'pick-member', groups: DOMESTICOS, items: ANIMALES }, count: 3 },
      { spec: { kind: 'facts', items: GRANJA }, count: 4 },
    ],
  },
  {
    id: 'antonimos',
    name: 'Antónimos',
    icon: '🌗',
    tint: '#d8ecff',
    plan: [
      { spec: { kind: 'pairs', rows: ADJETIVOS }, count: 3 },
      { spec: { kind: 'pairs', rows: VERBOS }, count: 3 },
      { spec: { kind: 'pairs', rows: CON_IN }, count: 2 },
      { spec: { kind: 'facts', items: ANTONIMOS }, count: 2 },
    ],
  },
  {
    id: 'erre',
    name: 'La r y la rr',
    icon: '🐸',
    tint: '#d9f4d2',
    plan: [
      { spec: { kind: 'classify', question: '¿Cómo es la R de «{item}»?', groups: SONIDOS_R, items: PALABRAS_R }, count: 4 },
      { spec: { kind: 'facts', items: FRASES_R }, count: 3 },
      { spec: { kind: 'pairs', rows: PAREJAS_R }, count: 3 },
    ],
  },
  {
    id: 'unir',
    name: 'Unir oraciones',
    icon: '🔗',
    tint: '#ffd9d2',
    plan: [
      { spec: { kind: 'facts', items: UNIR }, count: 6 },
      { spec: { kind: 'facts', items: SEPARAR }, count: 4 },
    ],
  },
  {
    id: 'oral-escrita',
    name: 'La lengua oral y la escrita',
    icon: '💬',
    tint: '#e3dbff',
    plan: [
      { spec: { kind: 'pick-member', groups: LENGUAS, items: ACCIONES }, count: 4 },
      { spec: { kind: 'facts', items: ORAL_ESCRITA }, count: 6 },
    ],
  },
  {
    id: 'simbolos',
    name: 'Símbolos y cómic',
    icon: '💭',
    tint: '#ffe0f0',
    plan: [
      { spec: { kind: 'pairs', rows: SIMBOLOS }, count: 4 },
      { spec: { kind: 'facts', items: SOBRE_SIMBOLOS }, count: 3 },
      { spec: { kind: 'facts', items: COMIC }, count: 3 },
    ],
  },
  {
    id: 'lectura',
    name: 'Comprensión lectora',
    icon: '📖',
    tint: '#fff0c2',
    plan: [{ spec: { kind: 'facts', items: LECTURAS }, count: 10 }],
  },
]
