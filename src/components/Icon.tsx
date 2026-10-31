import { iconosInterfaz } from '../icons'
import type { UiIcon, UiIconName } from '../icons'
import { ArrowIcon } from './ArrowIcon'

type IconProps = {
  name: UiIconName
  className?: string
}

// Icono de la interfaz (ver src/icons.ts): decorativo, el nombre accesible lo pone el botón que lo contiene
export function Icon({ name, className }: IconProps) {
  const icon: UiIcon = iconosInterfaz[name]
  return (
    <span className={className} aria-hidden="true">
      {icon.arrow ? <ArrowIcon direction={icon.arrow} /> : icon.glyph}
    </span>
  )
}
