# Repasitos

Web para repasar jugando las materias de 3º de Infantil y 2º de Primaria.

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
├── .github/workflows/deploy.yml   # Build y despliegue a Pages al hacer push a main
├── public/                        # Estáticos (favicon)
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Pantalla de inicio: elegir perfil
│   └── index.css
├── index.html
├── vite.config.ts                 # base: '/repasitos/' para GitHub Pages
├── README.md
└── CLAUDE.md
```

## Desarrollo

```bash
npm install
npm run dev       # servidor local
npm run build     # compila a dist/
npm run lint
```

## Publicación

Repositorio público en GitHub. En *Settings → Pages* hay que elegir **Source: GitHub Actions**; después cada push a `main` publica la web en `https://<usuario>.github.io/repasitos/`.

## Estado

Proyecto recién creado con la pantalla de inicio. Pendiente de definir las materias y los primeros ejercicios.
