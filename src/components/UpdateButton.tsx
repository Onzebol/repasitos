import { useSyncExternalStore } from 'react'
import { applyUpdate, hasUpdate, subscribeUpdate } from '../swUpdate'

// Botón flotante que aparece cuando hay una versión nueva de la app instalada
export function UpdateButton() {
  const available = useSyncExternalStore(subscribeUpdate, hasUpdate)
  if (!available) return null
  return (
    <button className="update-button" onClick={() => applyUpdate()}>
      <span aria-hidden="true">🔄</span> Actualizar
    </button>
  )
}
