# Repasitos

Web educativa para repasar las materias de dos cursos: 3º de Infantil y 2º de Primaria. Ver `README.md` para el contexto general.

## Público

Usuarios finales: niños y niñas de 5-6 y 7-8 años. Los adultos mantienen el proyecto. Todo debe poder usarse sin ayuda.

## Stack

Vite + React + TypeScript. Publicado en GitHub Pages desde un repositorio público; el despliegue lo hace `.github/workflows/deploy.yml` en cada push a `main`.

- `vite.config.ts` usa `base: '/repasitos/'`: mantenerlo si se renombra el repositorio.
- Para ficheros de `public/` usar `import.meta.env.BASE_URL` como prefijo.
- Sitio estático sin servidor: si se añade router, usar `HashRouter` (Pages no hace fallback a `index.html`).
- Comandos: `npm run dev`, `npm run build` (debe pasar sin errores antes de cada push), `npm run lint`.
- Versiones de referencia (revisadas el 2026-10-30): Node 24 LTS (`.nvmrc`, usado por CI y despliegue; mínimo `>=22.12` por Vite 8), Vite 8, React 19, TypeScript 7, `@types/node` alineado con la major de Node (24).
- Sin dependencias nuevas salvo necesidad clara.

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

- Cada perfil (`infantil`, `primaria`) tiene su carpeta en `src/` con una pantalla por materia.
- Los ejercicios se definen como datos (arrays tipados en TS) separados de la lógica, para añadir contenido sin tocar los componentes.
- Componentes y estilos compartidos en `src/components/` y `src/assets/`.
- Repositorio público: no subir datos personales ni fotos de menores.

## Notas de trabajo

- Antes de añadir una materia nueva, confirmar con el usuario el temario del curso. Investigación y estado actual del temario en `docs/temario.md` e índices de unidades de 2º de Primaria en `docs/`. Mantener `README.md` y `CLAUDE.md` al día en la misma PR que cambie algo que los deje desfasados.
- Mantener los cambios pequeños y verificarlos con `npm run dev` en el navegador.

## Flujo de trabajo (issues y PR)

- Todo trabajo pendiente (tareas, pasos, mejoras) se anota como issue en GitHub con la plantilla "Tarea / mejora". Incluir una imagen aclaratoria siempre que el cambio sea visual o necesite explicarse; sin fotos de menores ni datos personales.
- Al empezar una issue: rama `issue-<n>-<slug>` desde `main` y PR en borrador con `Closes #<n>`. No se hace push directo a `main`.
- El CI (`.github/workflows/ci.yml`) ejecuta `npm run lint` y `npm run build` en cada PR y deja `dist` como artefacto para revisar.
- Se hace merge solo tras revisión del usuario; al entrar en `main`, `deploy.yml` publica en GitHub Pages (CD).
