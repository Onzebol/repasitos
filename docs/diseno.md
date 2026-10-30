# Diseño de la aplicación

Estado: **en definición** (issue #8). Falta elegir el estilo visual entre los tres bocetos.

## Decisiones tomadas

- **Mascota única:** Repi, un zorro, común a los dos perfiles. Da la bienvenida, anima y celebra los aciertos.
- **Misma base, distinto tono:** los dos perfiles comparten componentes y navegación.
  - Infantil: iconos muy grandes, casi sin texto, apoyo de audio.
  - Primaria: tiles con nombre de la materia, frases cortas y paleta algo más sobria.
- **Pantallas clave:** inicio (elegir perfil), materias de Infantil, materias de Primaria. Siempre hay un botón de inicio y un botón de audio, grandes, en la esquina.
- **Sin tiempos límite ni penalizaciones**, y sin recogida de datos (ver `CLAUDE.md`).

## Estilos propuestos

Los bocetos son orientativos: iconos (emojis), colores y tipografías del sistema se afinarán después.

| Estilo | Idea | Imagen |
|---|---|---|
| A. Recortables de papel | Formas planas de colores vivos, bordes gruesos y sombras sólidas, como pegatinas | `docs/diseno/estilo-A.png` |
| B. Cuaderno y rotuladores | Papel cuadriculado, trazos de rotulador y tipografía manuscrita | `docs/diseno/estilo-B.png` |
| C. Mundo de cuento | Cielo y colinas, tarjetas redondeadas con iconos en círculos de colores | `docs/diseno/estilo-C.png` |

## Para decidir después de elegir el estilo

- Paleta final con contraste alto (revisar WCAG 2.2) y tipografía legible para primeros lectores, autoalojada (sin cargar fuentes de terceros).
- Ilustraciones definitivas de Repi (expresiones: contento, animando, celebrando) y de los iconos de cada materia.
- Componentes comunes: botón grande, tarjeta de materia, pantalla de ejercicio, feedback de acierto y de error.
- Audio: cuándo se usa y cómo se activa (sin reproducción automática molesta).
- Router: `HashRouter` (Pages no hace fallback a `index.html`).
