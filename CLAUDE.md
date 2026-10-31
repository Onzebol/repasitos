# Repasitos

Web educativa para repasar las materias de dos cursos: 3º de Infantil y 2º de Primaria. Ver `README.md` para el contexto general.

## Público

Usuarios finales: niños y niñas de 5-6 y 7-8 años. Los adultos mantienen el proyecto. Todo debe poder usarse sin ayuda.

## Stack

Vite + React + TypeScript. Publicado en GitHub Pages desde un repositorio público; el despliegue lo hace `.github/workflows/deploy.yml` en cada push a `main`.

- `vite.config.ts` usa `base: '/repasitos/'`: mantenerlo si se renombra el repositorio.
- Para ficheros de `public/` usar `import.meta.env.BASE_URL` como prefijo (en `index.html` y `manifest.webmanifest`, rutas relativas).
- App instalable (PWA): `public/manifest.webmanifest`, `public/sw.js` (red primero, copia sin conexión; la versión nueva espera a que se pulse «Actualizar») y iconos de Repi (`icon.svg` es la fuente de los PNG). Si se cambian los ficheros de `public/` que el service worker guarda, subir `CACHE` en `sw.js`. Aviso de versión nueva: el build sustituye `__BUILD__` en `dist/sw.js` (plugin de `vite.config.ts`) para que `sw.js` cambie en cada versión; `src/swUpdate.ts` detecta el service worker en espera y `UpdateButton` muestra el botón «Actualizar» (envía `SKIP_WAITING` y recarga). No quitar el marcador `__BUILD__` de `sw.js`.
- Sitio estático sin servidor: la navegación usa la dirección con almohadilla (`#/primaria/matematicas/u1/...`), porque Pages no hace fallback a `index.html`.
- Comandos: `npm run dev`, `npm test` (tests), `npm run build` (debe pasar sin errores antes de cada push), `npm run lint`.
- Versiones de referencia (revisadas el 2026-10-30): Node 24 LTS (`.nvmrc`, usado por CI y despliegue; mínimo `>=22.12` por Vite 8), Vite 8, React 19, TypeScript 7, `@types/node` alineado con la major de Node (24).
- Sin dependencias nuevas salvo necesidad clara.
- Emojis: la web incluye la fuente Noto Color Emoji (OFL) en `src/assets/fonts/noto-color-emoji/`, declarada en `src/assets/emoji-font.css`, para que se vean igual en todos los sistemas (estilo Android, sin el borde negro de Windows). Va al final de `font-family` en `theme.css` (solo la usan los emojis) y los `button` heredan la fuente. Son copias de los ficheros que sirve Google Fonts (v50), servidos desde la propia web, sin terceros. No usar el paquete `@fontsource/noto-color-emoji`: sus ficheros se descargan pero no pintan nada en Chrome, Edge ni Brave.
- Iconos de la interfaz: se declaran en `src/icons.ts` (símbolo y para qué sirve) y se pintan con `<Icon name="..." />`; no escribir emojis ni símbolos sueltos en los componentes (un test lo vigila). Las flechas son un SVG (`ArrowIcon`): no usar `◀`/`▶`, que con la fuente de emojis salen como un triángulo dentro de un cuadrado. Los iconos de materias, unidades y temas van en sus datos. `#/iconos` (`IconsScreen`, sin botón en el inicio) lista los de la aplicación con su uso y el catálogo de emojis que dibuja la fuente (leído de `unicode-range` en `emoji-font.css`), para elegir iconos nuevos.

## Idioma

- Contenido, textos de la interfaz y comentarios: español (España).
- Nombres de archivos y de variables en el código: inglés o español sin tildes ni espacios, de forma consistente.

## Convenciones de diseño

- Estilo visual: "mundo de cuento" (cielo, colinas, tarjetas redondeadas) con la mascota Repi, un zorro común a los dos perfiles. Decisiones y bocetos en `docs/diseno.md`; tema en `src/assets/theme.css`.
- Interfaz pensada para tablet y táctil: botones grandes, zonas de toque amplias.
- Infantil: casi sin texto, apoyo en imágenes, iconos y audio; colores vivos; sin tiempos límite ni penalizaciones.
- Primaria: frases cortas, vocabulario de 2º, feedback inmediato y positivo ante errores ("¡Casi! Inténtalo otra vez").
- Accesibilidad: contraste alto, fuentes grandes y legibles.
- No incluir publicidad, rastreo ni recogida de datos personales de menores.

## Organización del contenido

- Cada perfil (`infantil`, `primaria`) tiene su carpeta en `src/` con sus materias como datos (`materias.ts`) y, más adelante, una pantalla por materia. La navegación se sincroniza con `location.hash` (sin dependencias): `src/routes.ts` convierte dirección ↔ pantalla y `App.tsx` la lee con `hashchange`, así funciona el botón atrás del navegador y del móvil, recargar y compartir una pantalla; la lectura en voz alta usa la síntesis de voz del navegador (`src/speak.ts`). `#/voces` (`VoicesScreen`, solo por dirección, sin botón en el inicio) es una herramienta para adultos que lista las voces `es-*` del dispositivo (`src/voices.ts`: `spanishVoices` las ordena, naturales y de Google primero) y las prueba con velocidad y tono (#66); sirve para elegir la voz que luego usará `speak.ts`.
- Los ejercicios se definen como datos tipados en TS, separados de la lógica, para añadir contenido sin tocar los componentes. Tipos en `src/types.ts`: `Unit` → `Topic` → `plan` de bloques (`{ spec, count }`). Cada tema tiene un plan de 10 ejercicios por sesión; cada `spec` es una plantilla declarativa (`kind: 'column'`, `'neighbor'`, `'mental'`…) que `src/generators.ts` convierte en un ejercicio nuevo, o una lista escrita a mano (`kind: 'bag'`) de la que se toman distintos. `src/session.ts` (`buildSession`) monta la sesión: sigue el orden del plan, no repite ejercicios, baraja las opciones y, al repetir, evita los de la sesión anterior. El azar viene de `src/random.ts` (`Rng` inyectable, `mulberry32(seed)` en los tests). Un ejercicio es de elegir una respuesta, de escribir un número o de sumar/restar en columna con un cuadro por cifra del resultado (`ColumnExercise` en `src/components/`: llevada opcional, que no se comprueba, y cuadro de centenas solo si el resultado llega a 100). Ejemplo: `src/primaria/matematicas/unidad1.ts`; las unidades sin temas salen como "Muy pronto". Trazo guiado de cifras (Infantil): recorridos en `src/infantil/trazos.ts` (contrastados con los cuadernos), lógica pura en `src/trace.ts` (`advance`, `lift`, `traced`; la salida marca el sentido y se avanza punto a punto), componente `TraceExercise` (eventos de puntero, `touch-action: none`, botón «Ya lo he hecho») y plantilla `{ kind: 'trace', min?, max? }`; `#/trazo` (solo por dirección) muestra los recorridos y deja probar cada cifra. Para un tipo de ejercicio nuevo: añadir su `kind` en `BlockSpec`, su caso en `generate` (el `switch` es exhaustivo) y sus tests. Los ejercicios se escriben desde cero, sin copiar los del libro.
- Infantil: sus materias con ejercicios se registran en `src/infantil/contenido.ts` (Números en `src/infantil/numeros/`). No hay unidades: la materia abre directamente sus temas (`#/infantil/numeros`, ejercicio `#/infantil/numeros/<tema>`). Las pantallas de unidades, temas y práctica llevan el `profile` (los ids de materia se repiten entre perfiles), `hasContent(profile, subject)` decide qué botones de materia están desactivados, y los botones de materia sin contenido se muestran desactivados en los dos perfiles (por dirección todavía abren «¡Muy pronto!»). Plantillas de Números: `how-many` (animales de `src/infantil/animales.ts`, hasta el 7; con `tap: true` el ejercicio lleva `tapToCount` y `Practice` muestra `CountTap`: se tocan los dibujos de uno en uno, cada uno dice su número en voz alta, y al contarlos todos salen las cifras para elegir), `group` («¿Dónde hay 3?»: tres grupos de dibujos como opciones), `next-number` (antes, después y el que falta, del 1 al 9), `more-less` (dos grupos de dibujos), `digit` (hasta el 9) y `trace`. Cuando las opciones son dibujos, el ejercicio lleva `labels` (nombre accesible de cada opción, «3 perros») y `Practice` las usa como `aria-label` con el estilo `option-group`.
- Conocimiento del medio (Primaria): `src/primaria/medio/` (`unidad1.ts` y `unidades.ts` con las 9 unidades del índice; las que no tienen temas salen «Muy pronto»). Los ejercicios son de elegir, escritos a mano como listas `bag` (cada lista con bastantes más ejercicios de los que se toman por sesión). Sus tests comprueban los hechos por separado (a qué grupo pertenece cada alimento, el orden del camino de la digestión) y que todos los emojis están en la fuente (`emojisDeLaFuente`). Las fotos del libro y sus anotaciones personales no se suben al repositorio.
- Componentes y estilos compartidos en `src/components/` y `src/assets/`.
- Repositorio público: no subir datos personales ni fotos de menores.

## Notas de trabajo

- Antes de añadir una materia nueva, confirmar con el usuario el temario del curso. Investigación y estado actual del temario en `docs/temario.md` e índices de unidades de 2º de Primaria en `docs/`. Mantener `README.md` y `CLAUDE.md` al día en la misma PR que cambie algo que los deje desfasados.
- Mantener los cambios pequeños y verificarlos con `npm run dev` en el navegador.

## Desarrollo guiado por tests (TDD)

- Se trabaja con TDD: primero se escribe un test que falla, luego el código mínimo para que pase y después se refactoriza. Vale para lógica, componentes y datos de ejercicios.
- Cada cambio de comportamiento lleva su test en la misma PR; un fallo corregido se empieza con un test que lo reproduzca.
- Los tests deben pasar (`npm test`, además de `npm run lint` y `npm run build`) antes de cada push; el CI también los ejecuta.
- Herramientas: Vitest con jsdom y Testing Library (`@testing-library/react`, `user-event`, `jest-dom`). `npm test` ejecuta todo una vez y `npm run test:watch` queda vigilando cambios.
- Los tests van junto al código (`Algo.test.ts` o `Algo.test.tsx`); la configuración común está en `src/test/setup.ts`. Se importan `describe`, `it` y `expect` de `vitest` (sin globales).
- Los tests de componentes se escriben como los usaría una persona: buscar por rol y nombre accesible (`getByRole`), no por clases CSS.
- Los datos de ejercicios tienen sus propios tests (respuesta entre las opciones, operaciones correctas); como los ejercicios se generan al azar, se comprueban sobre muchas semillas (`mulberry32(0..N)`), no sobre un único resultado. Cada unidad nueva registra las comprobaciones comunes con `describeUnit` (`src/test/unitChecks.ts`) y añade las suyas. Al añadir contenido nuevo se añaden o amplían.
- Al empezar con un test que ya pasa porque el código existía, comprobar que puede fallar estropeando el código a propósito.

## Flujo de trabajo (issues y PR)

- Todo trabajo pendiente (tareas, pasos, mejoras) se anota como issue en GitHub con la plantilla "Tarea / mejora". Incluir una imagen aclaratoria siempre que el cambio sea visual o necesite explicarse; sin fotos de menores ni datos personales.
- Al empezar una issue: rama `issue-<n>-<slug>` desde `main` y PR en borrador con `Closes #<n>`. No se hace push directo a `main`.
- Cada issue se resuelve siempre en un worktree propio (`git worktree add ../repasitos-issue-<n> -b issue-<n>-<slug> main`, o `EnterWorktree`), no cambiando de rama en la carpeta principal, para poder trabajar en varias issues a la vez en el mismo repositorio. En un worktree nuevo hay que ejecutar `npm install`. Al terminar (PR fusionada) se elimina con `git worktree remove`.
- El CI (`.github/workflows/ci.yml`) ejecuta `npm run lint`, `npm test` y `npm run build` en cada PR y deja `dist` como artefacto para revisar.
- Se hace merge solo tras revisión del usuario; al entrar en `main`, `deploy.yml` publica en GitHub Pages (CD).
