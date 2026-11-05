import type { CountMobileData } from '../types'
import { Icon } from './Icon'

// Móvil de círculos de colores y tamaños para contar con dos criterios: cada círculo lleva su color y su tamaño como nombre
export function CountMobile({ data }: { data: CountMobileData }) {
  return (
    <div className="count-mobile" role="img" aria-label="Móvil de círculos de colores y tamaños">
      {data.items.map((item, i) => (
        <span key={i} className={item.big ? 'count-big' : 'count-small'} role="img" aria-label={`círculo ${item.color} ${item.big ? 'grande' : 'pequeño'}`}>
          <Icon name={`circle-${item.color}`} />
        </span>
      ))}
    </div>
  )
}
