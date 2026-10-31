import { useSyncExternalStore } from 'react'
import { Icon } from './Icon'
import { applyUpdate, hasUpdate, subscribeUpdate } from '../swUpdate'

// Botón flotante que aparece cuando hay una versión nueva de la app instalada
export function UpdateButton() {
  const available = useSyncExternalStore(subscribeUpdate, hasUpdate)
  if (!available) return null
  return (
    <button className="update-button" onClick={() => applyUpdate()}>
      <Icon name="update" /> Actualizar
    </button>
  )
}
