import { useMemo, useState } from 'react'
import emojiCss from '../assets/emoji-font.css?raw'
import { categoriaDe, emojisDeLaFuente } from '../emojiFont'
import { agruparPorIcono, usosDeIconos } from '../iconUses'
import type { IconUse } from '../iconUses'
import { ArrowIcon } from './ArrowIcon'
import { Hills } from './Hills'
import { TopBar } from './TopBar'

const ETIQUETA: Record<IconUse['tipo'], string> = {
  interfaz: '',
  materia: 'Materia · ',
  unidad: 'Unidad · ',
  tema: 'Tema · ',
}

// Caracteres que se ven como emoji con cuadrado: para flechas está ArrowIcon
const NO_USAR = new Set([String.fromCodePoint(0x25c0), String.fromCodePoint(0x25b6)])

const codigo = (emoji: string) => `U+${(emoji.codePointAt(0) ?? 0).toString(16).toUpperCase()}`

type IconsScreenProps = {
  onHome: () => void
}

// Página para adultos (#/iconos, sin botón en el inicio): qué iconos usa la aplicación y para qué,
// y cuáles se pueden usar al añadir contenido nuevo.
export function IconsScreen({ onHome }: IconsScreenProps) {
  const [message, setMessage] = useState('')
  const usos = useMemo(() => usosDeIconos(), [])
  const grupos = useMemo(() => agruparPorIcono(usos), [usos])
  const enUso = useMemo(() => new Set(usos.map((uso) => uso.icono)), [usos])
  const categorias = useMemo(() => {
    const porCategoria = new Map<string, string[]>()
    for (const emoji of emojisDeLaFuente(emojiCss)) {
      const categoria = categoriaDe(emoji)
      porCategoria.set(categoria, [...(porCategoria.get(categoria) ?? []), emoji])
    }
    return [...porCategoria.entries()]
  }, [])

  const copiar = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji)
      setMessage(`Copiado ${emoji}`)
    } catch {
      setMessage(`No se ha podido copiar ${emoji}: selecciónalo a mano`)
    }
  }

  return (
    <main className="screen icons-page">
      <Hills />
      <TopBar title="Iconos" prompt="Iconos" onHome={onHome} />
      <div className="icons-content">
        <section aria-labelledby="iconos-uso" className="icons-section">
          <h2 id="iconos-uso">Iconos que usa la aplicación</h2>
          <p>Cada icono con lo que significa y dónde aparece. Se generan a partir de los datos: si se añade una materia, unidad o tema, sale aquí.</p>
          <ul className="icon-groups">
            {grupos.map((grupo) => (
              <li key={grupo.icono} className="icon-group">
                <span className="icon-sample" aria-hidden="true">
                  {grupo.flecha ? <ArrowIcon direction={grupo.flecha} /> : grupo.icono}
                </span>
                <ul>
                  {grupo.usos.map((uso) => (
                    <li key={`${uso.tipo}-${uso.uso}-${uso.donde}`}>
                      <span className="icon-use">{`${ETIQUETA[uso.tipo]}${uso.uso}`}</span>
                      <small>{uso.donde}</small>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="iconos-catalogo" className="icons-section">
          <h2 id="iconos-catalogo">Iconos que puedes usar</h2>
          <p>
            Son los emojis que dibuja la fuente Noto Color Emoji incluida en la web (solo caracteres sueltos: no están las
            combinaciones, como banderas o tonos de piel). Algunos símbolos (flechas, marca comercial) salen en negro porque la fuente de la web los dibuja antes que la de emojis. Van agrupados por bloque de Unicode, no por tema. Pulsa uno para
            copiarlo; el punto verde marca los que ya se usan en la aplicación y el rojo los que no hay que usar.
          </p>
          <p className="icons-status" role="status">{message}</p>
          {categorias.map(([categoria, emojis]) => (
            <div key={categoria}>
              <h3>{categoria}</h3>
              <div className="icon-grid">
                {emojis.map((emoji) => {
                  const evitar = NO_USAR.has(emoji)
                  const usado = enUso.has(emoji)
                  return (
                    <button
                      key={emoji}
                      className="icon-cell"
                      data-used={evitar ? 'avoid' : usado}
                      aria-label={`Copiar ${emoji} (${codigo(emoji)})${evitar ? ' — no usar, hay una flecha SVG' : usado ? ' — en uso' : ''}`}
                      title={codigo(emoji)}
                      onClick={() => copiar(emoji)}
                    >
                      {emoji}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
