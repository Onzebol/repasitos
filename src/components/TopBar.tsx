import { useLayoutEffect, useRef, useState } from 'react'
import { speak } from '../speak'
import { Icon } from './Icon'
import { titleFits } from './titleFits'

type TopBarProps = {
  title?: string
  prompt: string
  onHome: () => void
  onBack?: () => void
}

export function TopBar({ title, prompt, onHome, onBack }: TopBarProps) {
  const bar = useRef<HTMLElement>(null)
  const left = useRef<HTMLDivElement>(null)
  const right = useRef<HTMLDivElement>(null)
  const measure = useRef<HTMLSpanElement>(null)
  const [stacked, setStacked] = useState(false)

  // El título va en el centro si cabe; si no, pasa a una segunda línea
  useLayoutEffect(() => {
    const element = bar.current
    if (!element || !title) return
    const update = () => {
      const style = getComputedStyle(element)
      const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0)
      setStacked(
        !titleFits({
          textWidth: measure.current?.offsetWidth ?? 0,
          barWidth: element.clientWidth - padding,
          sideWidth: Math.max(left.current?.offsetWidth ?? 0, right.current?.offsetWidth ?? 0),
          gap: parseFloat(style.columnGap) || 0,
        }),
      )
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [title])

  return (
    <header className="topbar" ref={bar} data-stacked={stacked}>
      <div className="topbar-left" role="group" aria-label="Navegación" ref={left}>
        <button className="round-button" onClick={onHome} aria-label="Volver al inicio">
          <Icon name="home" />
        </button>
        {onBack && (
          <button className="round-button" onClick={onBack} aria-label="Volver atrás">
            <Icon name="back" />
          </button>
        )}
      </div>
      {title && (
        <>
          <h1 className="topbar-title">{title}</h1>
          <span className="topbar-title topbar-measure" aria-hidden="true" ref={measure}>
            {title}
          </span>
        </>
      )}
      <div className="topbar-right" ref={right}>
        <button className="round-button" onClick={() => speak(prompt)} aria-label="Escuchar">
          <Icon name="sound" />
        </button>
      </div>
    </header>
  )
}
