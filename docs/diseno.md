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

## Para decidir después de elegir el estilo

- Paleta final con contraste alto (revisar WCAG 2.2) y tipografía legible para primeros lectores, autoalojada (sin cargar fuentes de terceros).
- Ilustraciones definitivas de Repi (expresiones: contento, animando, celebrando) y de los iconos de cada materia.
- Componentes comunes: botón grande, tarjeta de materia, pantalla de ejercicio, feedback de acierto y de error.
- Audio: cuándo se usa y cómo se activa (sin reproducción automática molesta).
- Navegación por dirección con almohadilla (`#/...`, solución propia en `src/routes.ts`; Pages no hace fallback a `index.html`).

## Implementado

- Tema del estilo C en `src/assets/theme.css` (variables de color, tarjetas redondeadas, foco visible, `prefers-reduced-motion`).
- Componentes compartidos en `src/components/`: `Mascot` (Repi) y `Hills` (colinas del fondo).
- Pantalla de inicio con la elección de perfil (`docs/diseno/inicio-implementado.png`, y versión móvil).
- Tipografía provisional: Trebuchet MS con respaldo del sistema. Pendiente elegir una fuente legible para primeros lectores y alojarla en el repo.
- Pendiente: pantallas de materias, ejercicios y feedback (dependen de confirmar las materias, issue #2).
