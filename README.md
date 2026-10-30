# Repasitos

Web para repasar jugando las materias de 3º de Infantil y 2º de Primaria.

**Web publicada:** <https://onzebol.github.io/repasitos/>

![Pantalla de inicio](docs/diseno/inicio-implementado.png)

## Perfiles

| Perfil | Curso | Notas |
|--------|-------|-------|
| Infantil | 3º de Infantil (5-6 años) | Muy visual, textos mínimos, botones grandes, sin necesidad de leer mucho |
| Primaria | 2º de Primaria (7-8 años) | Lectura sencilla, ejercicios cortos, retroalimentación inmediata |

## Objetivos

- Repasar las materias del curso con ejercicios cortos y atractivos.
- Que cada perfil tenga su espacio con contenido adaptado a su nivel.
- Que funcione en tablet y ordenador, sin instalar nada (publicado en GitHub Pages).

## Tecnologías

Vite + React + TypeScript. Despliegue automático en GitHub Pages con GitHub Actions.

## Estructura

```
repasitos/
├── .github/
│   ├── workflows/ci.yml           # Lint y build en cada PR
│   ├── workflows/deploy.yml       # Build y despliegue a Pages al hacer push a main
│   ├── ISSUE_TEMPLATE/            # Plantilla de tarea
│   └── pull_request_template.md
├── docs/                          # Temario, índices de unidades y diseño
├── public/                        # Iconos, manifest y service worker (app instalable)
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Pantalla de inicio: elegir perfil
│   ├── components/                # Mascot (Repi), Hills, TopBar, SubjectsScreen...
│   ├── infantil/materias.ts       # Materias de 3º de Infantil (datos)
│   ├── primaria/materias.ts       # Materias de 2º de Primaria (datos)
│   ├── types.ts, speak.ts         # Tipos compartidos y lectura en voz alta
│   └── assets/theme.css           # Tema visual (estilo "mundo de cuento")
├── index.html
├── .nvmrc                         # Node 24 LTS
├── vite.config.ts                 # base: '/repasitos/' para GitHub Pages
├── README.md
└── CLAUDE.md
```

## Instalar en el móvil o la tablet

La web es instalable (PWA) y funciona sin conexión una vez abierta:

- **Android (Chrome):** menú ⋮ → *Instalar aplicación* (o *Añadir a la pantalla de inicio*).
- **iPhone y iPad (Safari):** botón Compartir → *Añadir a pantalla de inicio*.

## Desarrollo

```bash
npm install
npm run dev       # servidor local
npm run build     # compila a dist/
npm run lint
```

## Publicación

Repositorio público en GitHub. En *Settings → Pages* hay que elegir **Source: GitHub Actions**; después cada push a `main` publica la web en <https://onzebol.github.io/repasitos/>.

## Flujo de trabajo

Las tareas se anotan como issues (con imagen aclaratoria cuando haga falta). Cada issue se trabaja en una rama y una PR en borrador; el CI (lint y build) debe pasar y, tras la revisión, el merge a `main` publica la web. Detalle en `CLAUDE.md`.

## Documentación

- `docs/temario.md`: temario de los dos cursos, fuentes y tareas pendientes.
- `docs/matematicas-2-primaria.md`, `docs/lengua-2-primaria.md`, `docs/conocimiento-del-medio-2-primaria.md`: índices de unidades de 2º de Primaria.
- `docs/diseno.md`: decisiones de diseño y bocetos (`docs/diseno/`).

## Estado

Hecho: icono de la app (Repi) y web instalable en el móvil; pantalla de inicio y pantallas de materias de cada perfil con el estilo elegido (mundo de cuento) y la mascota Repi, CI y despliegue, materias confirmadas y temario de 2º de Primaria. Cada materia abre de momento una pantalla "¡Muy pronto!". Pendiente: ejercicios y feedback, y el temario de 3º de Infantil.
