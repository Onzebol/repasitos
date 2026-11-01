# Diseño de la aplicación

Estado: **estilo C elegido** (issue #8). Puede revisarse más adelante; los estilos A y B quedan como alternativa en los bocetos.

## Decisiones tomadas

- **Mascota única:** Repi, un zorro, común a los dos perfiles. Da la bienvenida, anima y celebra los aciertos.
- **Misma base, distinto tono:** los dos perfiles comparten componentes y navegación.
  - Infantil: iconos muy grandes, casi sin texto, apoyo de audio.
  - Primaria: tiles con nombre de la materia, frases cortas y paleta algo más sobria.
- **Pantallas clave:** inicio (elegir perfil), materias de Infantil y de Primaria, ejercicio de Infantil, ejercicio de Primaria con un fallo ("¡Casi! Inténtalo otra vez") y pantalla de acierto. Siempre hay un botón de inicio y un botón de audio, grandes, en la esquina.
- **Sin tiempos límite ni penalizaciones**, y sin recogida de datos (ver `CLAUDE.md`).

## Estilos propuestos

Los bocetos son orientativos: iconos (emojis), colores y tipografías del sistema se afinarán después.

| Estilo | Idea | Imágenes (en `docs/diseno/`) |
|---|---|---|
| A. Recortables de papel | Formas planas de colores vivos, bordes gruesos y sombras sólidas, como pegatinas | `estilo-A.png`, `estilo-A-ejercicios.png` |
| B. Cuaderno y rotuladores | Papel cuadriculado, trazos de rotulador y tipografía manuscrita | `estilo-B.png`, `estilo-B-ejercicios.png` |
| C. Mundo de cuento | Cielo y colinas, tarjetas redondeadas con iconos en círculos de colores | `estilo-C.png`, `estilo-C-ejercicios.png` |

## Decisiones cerradas (revisadas el 2026-11-01, issue #8)

- **Paleta y contraste:** texto `#14405a` sobre tarjetas blancas 10,99 : 1, sobre el cielo 10,04 : 1 (abajo) y 7,50 : 1 (arriba), y sobre el verde de «contado» 7,13 : 1. El texto secundario (`#3d6f8a`: cabeceras de la columna, subtítulos de la pantalla de iconos) da 5,0 a 5,5 : 1 sobre cielo claro y blanco. Todo cumple AA (4,5 : 1) de WCAG 2.2. Foco visible con `:focus-visible` y `prefers-reduced-motion` respetado.
- **Estilo Infantil:** dibujos de `clamp(3rem, 14vw, 5rem)`, opciones de al menos 7 × 6,5 rem, casi sin texto, apoyo de voz (contar tocando, trazo guiado, botón de escuchar), colores vivos, sin tiempos límite ni penalizaciones.
- **Audio:** solo con una acción del niño, nunca automático. Hay tres sitios: el botón «Escuchar» de la barra superior (lee el enunciado), `CountTap` (dice cada número al tocarlo) y `TraceExercise` (dice la cifra). Usa la síntesis de voz del navegador (`src/speak.ts`); la herramienta `#/voces` sirve para elegir la voz. Audios pregrabados con voz de IA: issue #70.
- **Tamaños de toque:** los botones de uso normal miden al menos 3,25 rem (52 px): barra superior 4,5 rem, teclado, opciones y tarjetas mucho más grandes. Excepciones pequeñas: el cuadro opcional de llevada (2 rem, 32 px, supera el mínimo de 24 px de WCAG 2.2 AA pero no los 44 px recomendados) y las herramientas para adultos (`#/voces`, `#/iconos`).
- **Componentes comunes:** `TopBar` (inicio, volver y escuchar, botones redondos), `SubjectsScreen`, `ListScreen`, `Practice` (pregunta, opciones, feedback «¡Muy bien!» / «¡Casi! Inténtalo otra vez»), `Keypad`, `Mascot` (Repi) y `Hills`.
- **Navegación:** por dirección con almohadilla (`#/...`, solución propia en `src/routes.ts`; Pages no hace fallback a `index.html`).
- **Emojis:** Noto Color Emoji incluida en la web (sin terceros), mismo aspecto en todos los sistemas.
- **Tipografía:** Trebuchet MS con respaldo del sistema (`system-ui`), sin fuentes de terceros. Aceptada por ahora; si se quisiera una fuente pensada para primeros lectores habría que alojarla en el repositorio (issue nueva).
- **Pruebas en tablet real:** se hacen al revisar cada PR (capturas en el navegador y revisión del usuario en su tablet); no hay una pasada formal.

## Implementado

- Tema del estilo C en `src/assets/theme.css` (variables de color, tarjetas redondeadas, foco visible, `prefers-reduced-motion`); un test vigila que sus llaves estén equilibradas.
- Inicio con la elección de perfil, materias de cada perfil, unidades, temas y ejercicios de Primaria e Infantil (capturas de la primera versión en `docs/diseno/`).
- Ilustraciones de Repi: una sola versión por ahora; las expresiones (contento, animando, celebrando) quedan como mejora futura.
