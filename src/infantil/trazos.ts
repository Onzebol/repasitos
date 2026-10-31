// Recorrido de cada cifra para el trazo guiado (#50): lista de trazos (cada vez que se levanta el dedo es uno nuevo),
// cada trazo es una línea de puntos [x, y] en un cuadro de WIDTH × HEIGHT, con el origen arriba a la izquierda.
// Dibujados desde cero, contrastados con los cuadernos de Edelvives (cifras 1 a 7: la flecha marca la salida y el punto verde la llegada): todas empiezan por arriba; el 4 es el cerrado, con el brazo recto («silla invertida») que llega hasta el palo; el 7 lleva raya cruzada; el 0, el 6 y el 9 giran
// en sentido contrario a las agujas del reloj. El orden y la dirección hay que contrastarlos con los cuadernos.

export type Point = [number, number]
export type Stroke = Point[]

export const WIDTH = 100
export const HEIGHT = 140
export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const
export type Digit = (typeof DIGITS)[number]

const round = (n: number) => Math.round(n * 10) / 10

// Arco de elipse: 0° es la derecha y 90° es abajo (el eje y baja), así que los grados que suben van en el sentido
// de las agujas del reloj y los que bajan, en el contrario.
function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number): Stroke {
  const steps = Math.max(2, Math.ceil(Math.abs(to - from) / 15))
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = ((from + ((to - from) * i) / steps) * Math.PI) / 180
    return [round(cx + rx * Math.cos(t)), round(cy + ry * Math.sin(t))] as Point
  })
}

// Ocho en una sola línea cerrada: sale de arriba hacia la izquierda, baja cruzando por el centro, rodea el lazo de
// abajo y sube cruzando otra vez hasta el punto de salida (curva de Lissajous 2:1).
function ocho(): Stroke {
  const steps = 48
  return Array.from({ length: steps + 1 }, (_, i) => {
    const u = (2 * Math.PI * i) / steps
    return [round(50 - 28 * Math.sin(2 * u)), round(72 - 62 * Math.cos(u))] as Point
  })
}

// Une tramos en un solo trazo sin repetir los puntos de unión
const join = (...parts: Stroke[]): Stroke =>
  parts.flatMap((part, i) => {
    const [x, y] = part[0]
    const last = i > 0 ? parts[i - 1].at(-1) : undefined
    return last && last[0] === x && last[1] === y ? part.slice(1) : part
  })

export const TRAZOS: Record<Digit, Stroke[]> = {
  0: [arc(50, 70, 30, 60, -90, -450)],
  1: [[[28, 40], [52, 12], [52, 132]]],
  2: [join(arc(50, 38, 28, 28, 180, 400), [[22, 130], [82, 130]])],
  3: [join(arc(50, 36, 26, 26, 200, 450), arc(50, 96, 32, 34, 270, 520))],
  4: [
    [[24, 12], [24, 78], [64, 78]],
    [[64, 12], [64, 132]],
  ],
  5: [
    join([[28, 12], [26, 66]], arc(46, 98, 32, 34, -120, 150)),
    [[28, 12], [78, 12]],
  ],
  6: [join(arc(60, 70, 38, 60, -70, -270), arc(60, 98, 30, 32, 90, -180))],
  7: [
    [[20, 12], [80, 12], [42, 132]],
    [[36, 76], [84, 76]],
  ],
  8: [ocho()],
  9: [join(arc(50, 42, 28, 30, 0, -360), [[78, 42], [78, 90]], arc(48, 90, 30, 40, 0, 140))],
}

// Camino SVG de un trazo: "M1 2L3 4L5 6"
export const pathData = (stroke: Stroke): string =>
  stroke.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join('')

// Punto del trazo a una fracción de su longitud y ángulo (grados, 0 = derecha, 90 = abajo) con el que se avanza
export function arrowAt(stroke: Stroke, fraction: number): { x: number; y: number; angle: number } {
  const lengths = stroke.slice(1).map(([x, y], i) => Math.hypot(x - stroke[i][0], y - stroke[i][1]))
  let remaining = lengths.reduce((a, b) => a + b, 0) * fraction
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] || i === lengths.length - 1) {
      const [x1, y1] = stroke[i]
      const [x2, y2] = stroke[i + 1]
      const t = lengths[i] === 0 ? 0 : remaining / lengths[i]
      return {
        x: round(x1 + (x2 - x1) * t),
        y: round(y1 + (y2 - y1) * t),
        angle: round((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI),
      }
    }
    remaining -= lengths[i]
  }
  return { x: stroke[0][0], y: stroke[0][1], angle: 0 }
}
