import { describe, expect, it } from 'vitest'
import type { ChoiceExercise, Exercise, Topic } from '../../types'
import { temasUnidad1 } from './unidad1'

// Los cuatro temas de la unidad 1 que siguen al de la alimentación. Los hechos se escriben aquí por separado, para que un
// cambio en el contenido no pueda dar por buena una respuesta equivocada (y se contrastan con lo que enseña el libro).

const tema = (id: string): Topic => temasUnidad1.find((t) => t.id === id)!
const bolsas = (t: Topic) =>
  t.plan.flatMap((bloque) => (bloque.spec.kind === 'bag' ? [{ items: bloque.spec.items, count: bloque.count }] : []))
const elegir = (e: Exercise): ChoiceExercise => {
  if (e.type !== 'choice') throw new Error(`se esperaba elegir: ${e.question}`)
  return e
}
const ejercicios = (id: string) => bolsas(tema(id)).flatMap((bolsa) => bolsa.items).map(elegir)

// Todos los ejercicios que tienen esa pregunta (y la respuesta que deben tener)
function compruebaHechos(id: string, hechos: [pregunta: string, respuesta: string][]) {
  const lista = ejercicios(id)
  for (const [pregunta, respuesta] of hechos) {
    const con = lista.filter((e) => e.question === pregunta)
    expect(con.length, `falta el ejercicio «${pregunta}»`).toBeGreaterThan(0)
    for (const e of con) expect(e.answer, pregunta).toBe(respuesta)
  }
}

describe('Unidad 1 de Conocimiento del medio: los cinco temas, en el orden del libro', () => {
  it('son los cinco saberes de la unidad', () => {
    expect(temasUnidad1.map((t) => t.id)).toEqual(['cambiamos', 'funciones', 'movimiento', 'respirar', 'alimentacion'])
    expect(temasUnidad1.map((t) => t.name)).toEqual([
      'Nuestro cuerpo cambia',
      '¿Cómo funciona nuestro cuerpo?',
      '¿Cómo nos movemos?',
      'Necesitamos respirar',
      '¿Cómo nos alimentamos?',
    ])
  })

  it('cada tema tiene icono y color propios', () => {
    expect(new Set(temasUnidad1.map((t) => t.icon)).size).toBe(5)
    for (const t of temasUnidad1) expect(t.tint).toMatch(/^#/)
  })

  it('cada sesión mezcla las listas de cada tema como está previsto', () => {
    expect(bolsas(tema('cambiamos')).map((b) => b.count)).toEqual([5, 5])
    expect(bolsas(tema('funciones')).map((b) => b.count)).toEqual([5, 5])
    expect(bolsas(tema('movimiento')).map((b) => b.count)).toEqual([5, 5])
    expect(bolsas(tema('respirar')).map((b) => b.count)).toEqual([4, 3, 3])
  })

  it('todas las listas de todos los temas tienen bastantes más ejercicios de los que se toman', () => {
    for (const t of temasUnidad1) {
      for (const bolsa of bolsas(t)) expect(bolsa.items.length, t.name).toBeGreaterThanOrEqual(bolsa.count + 4)
    }
  })

  it('ninguna pregunta habla de la persona que contesta ni de su familia (no se piden datos personales)', () => {
    for (const t of temasUnidad1) {
      for (const e of ejercicios(t.id)) expect(e.question, e.question).not.toMatch(/\btu\b|\btus\b|\btu familia\b|\bmi\b|\bmis\b/i)
    }
  })
})

describe('«Nuestro cuerpo cambia»: etapas de la vida y cambios al crecer', () => {
  it('las etapas van en este orden: infancia, adolescencia, edad adulta y ancianidad', () => {
    compruebaHechos('cambiamos', [
      ['¿Cuál de estas etapas de la vida es la primera?', 'la infancia'],
      ['¿Cuál de estas etapas es la última?', 'la ancianidad'],
      ['¿Qué etapa viene justo después de la infancia?', 'la adolescencia'],
      ['¿Qué etapa viene justo después de la adolescencia?', 'la edad adulta'],
      ['¿Qué etapa viene justo después de la edad adulta?', 'la ancianidad'],
      ['¿Qué etapa viene justo antes de la edad adulta?', 'la adolescencia'],
    ])
  })

  it('un niño de 7 años está en la infancia, y los más mayores en la ancianidad', () => {
    compruebaHechos('cambiamos', [
      ['Un niño de 7 años está en la etapa de…', 'la infancia'],
      ['Las personas muy mayores están en la etapa de…', 'la ancianidad'],
    ])
  })

  it('al crecer cambian la altura, el pie, la voz y los dientes; no cambia el color de los ojos', () => {
    compruebaHechos('cambiamos', [
      ['¿Qué NO cambia cuando crecemos?', 'el color de los ojos'],
      ['¿Cuál de estas cosas cambia al crecer?', 'la altura'],
    ])
    for (const e of ejercicios('cambiamos')) {
      if (/cambia/.test(e.question) && !/NO cambia/.test(e.question)) {
        expect(e.answer, e.question).not.toMatch(/ojos/)
      }
    }
  })

  it('los primeros dientes son de leche, los que salen después son definitivos, y al nacer no tenemos', () => {
    compruebaHechos('cambiamos', [
      ['¿Tenemos dientes cuando nacemos?', 'no'],
      ['¿Cómo se llaman los primeros dientes?', 'dientes de leche'],
      ['¿Cómo se llaman los dientes que salen cuando se caen los de leche?', 'dientes definitivos'],
    ])
  })

  it('en la edad adulta se deja de crecer', () => {
    compruebaHechos('cambiamos', [['¿Qué pasa cuando llegamos a la edad adulta?', 'dejamos de crecer']])
  })

  it('las etapas de las preguntas de orden solo ofrecen las cuatro etapas del libro (no «bebé»)', () => {
    for (const e of ejercicios('cambiamos').filter((x) => /¿Qué etapa viene|¿Cuál de estas etapas/.test(x.question))) {
      for (const opcion of e.options) expect(opcion, e.question).toMatch(/infancia|adolescencia|edad adulta|ancianidad/)
    }
  })
})

describe('«¿Cómo funciona nuestro cuerpo?»: funciones vitales y sentidos', () => {
  it('cada sentido tiene su órgano', () => {
    compruebaHechos('funciones', [
      ['¿Con qué órgano vemos?', 'con los ojos'],
      ['¿Con qué órgano oímos?', 'con los oídos'],
      ['¿Con qué órgano olemos?', 'con la nariz'],
      ['¿Con qué órgano notamos los sabores?', 'con la lengua'],
      ['¿Con qué órgano notamos si algo es suave o áspero?', 'con la piel'],
    ])
  })

  it('y cada órgano tiene su sentido', () => {
    compruebaHechos('funciones', [
      ['¿Para qué sentido sirve la nariz?', 'el olfato'],
      ['¿Para qué sentido sirven los ojos?', 'la vista'],
      ['¿Para qué sentido sirve la lengua?', 'el gusto'],
      ['¿Para qué sentido sirve la piel?', 'el tacto'],
      ['¿Para qué sentido sirven los oídos?', 'el oído'],
    ])
  })

  it('son cinco sentidos y tres funciones vitales: relación, nutrición y reproducción', () => {
    compruebaHechos('funciones', [
      ['¿Cuántos sentidos tenemos?', 'cinco'],
      ['¿Cuántas funciones vitales realizan las personas?', 'tres'],
      ['¿Cuál de estas es una función vital?', 'la nutrición'],
    ])
  })

  it('cada función vital hace lo suyo: relación, nutrición (respirar y alimentarse) y reproducción', () => {
    compruebaHechos('funciones', [
      ['En la función de relación…', 'conocemos lo que nos rodea y reaccionamos'],
      ['En la función de nutrición…', 'respiramos y nos alimentamos'],
      ['¿Qué función permite que las personas adultas tengan hijos o hijas?', 'la reproducción'],
    ])
  })

  it('respirar y tomar el desayuno son nutrición; ver y reaccionar es relación', () => {
    compruebaHechos('funciones', [
      ['Si tomamos el desayuno, ¿qué función vital realizamos?', 'la nutrición'],
      ['Si respiramos, ¿qué función vital realizamos?', 'la nutrición'],
      ['Si vemos un semáforo en rojo y paramos, ¿qué función vital realizamos?', 'la relación'],
      ['Si una pareja de personas adultas tiene un bebé, ¿qué función vital realizan?', 'la reproducción'],
    ])
  })
})

describe('«¿Cómo nos movemos?»: huesos, articulaciones y músculos', () => {
  it('el esqueleto es el conjunto de los huesos, que son duros y rígidos y están dentro del cuerpo', () => {
    compruebaHechos('movimiento', [
      ['¿Cómo se llama el conjunto de todos los huesos del cuerpo?', 'el esqueleto'],
      ['¿Cómo son los huesos?', 'duros y rígidos'],
      ['¿Dónde están los huesos?', 'dentro del cuerpo'],
    ])
  })

  it('las articulaciones unen los huesos y dejan doblar el cuerpo (hombro, codo, muñeca, rodilla y tobillo)', () => {
    compruebaHechos('movimiento', [
      ['¿Qué une los huesos entre sí?', 'las articulaciones'],
      ['¿Para qué sirven las articulaciones?', 'para doblar partes del cuerpo'],
      ['¿Qué parte del cuerpo es una articulación?', 'el codo'],
      ['¿Cuál de estas partes es una articulación?', 'la rodilla'],
    ])
  })

  it('el cráneo y el fémur son huesos (no articulaciones)', () => {
    compruebaHechos('movimiento', [
      ['¿Cómo se llama el hueso de la cabeza?', 'el cráneo'],
      ['¿Cuál de estas partes es un hueso?', 'el fémur'],
    ])
  })

  it('los músculos son blandos y elásticos, están bajo la piel y se estiran y encogen sin romperse', () => {
    compruebaHechos('movimiento', [
      ['¿Cómo son los músculos?', 'blandos y elásticos'],
      ['¿Dónde están los músculos?', 'debajo de la piel'],
      ['¿Qué hacen los músculos sin romperse?', 'se estiran y se encogen'],
    ])
  })

  it('huesos y músculos trabajan juntos; con ejercicio los músculos son más fuertes', () => {
    compruebaHechos('movimiento', [
      ['¿Qué trabaja junto con los huesos para que nos movamos?', 'los músculos'],
      ['¿Qué pasa con los músculos cuanto más los usamos?', 'son más fuertes'],
      ['¿Qué nos ayuda a tener huesos y músculos sanos?', 'hacer ejercicio'],
    ])
  })

  it('el bíceps es del brazo y los gemelos, de la pierna', () => {
    compruebaHechos('movimiento', [
      ['¿Qué músculo está en el brazo?', 'el bíceps'],
      ['¿Qué músculos están en la pierna?', 'los gemelos'],
    ])
  })
})

describe('«Necesitamos respirar»: el aire, su camino y la respiración', () => {
  it('respiramos para obtener aire, que lleva el oxígeno que necesitamos', () => {
    compruebaHechos('respirar', [
      ['¿Para qué respiramos?', 'para obtener aire'],
      ['¿Cómo se llama el gas del aire que necesitamos para vivir?', 'el oxígeno'],
      ['¿Qué entra en nuestro cuerpo cuando respiramos?', 'aire'],
      ['¿Qué sale de nuestro cuerpo cuando espiramos?', 'aire'],
    ])
  })

  it('el aire entra por la nariz o la boca, pasa por la tráquea y llega a los pulmones, que absorben el oxígeno', () => {
    compruebaHechos('respirar', [
      ['¿Por dónde puede entrar el aire en el cuerpo?', 'por la nariz o por la boca'],
      ['Después de la nariz o la boca, ¿por qué tubo pasa el aire?', 'por la tráquea'],
      ['¿A dónde llega el aire después de pasar por la tráquea?', 'a los pulmones'],
      ['¿Qué órganos absorben el oxígeno?', 'los pulmones'],
      ['¿Qué viene después de la tráquea?', 'los pulmones'],
      ['¿Qué viene primero en el camino del aire?', 'la nariz o la boca'],
    ])
  })

  it('inspirar es tomar aire y espirar, expulsarlo', () => {
    compruebaHechos('respirar', [
      ['Inspirar es…', 'tomar aire'],
      ['Espirar es…', 'expulsar el aire'],
    ])
  })

  it('al leer o dibujar la respiración es tranquila y al correr o bailar, acelerada', () => {
    compruebaHechos('respirar', [
      ['Cuando leemos o dibujamos, la respiración es…', 'tranquila'],
      ['Cuando corremos o bailamos, la respiración es…', 'acelerada'],
    ])
  })

  it('respirar profundo ayuda a calmarnos: el aire se toma por la nariz y se expulsa poco a poco por la boca', () => {
    compruebaHechos('respirar', [
      ['Respirar profundamente nos ayuda a…', 'calmarnos'],
      ['Para respirar profundo, ¿por dónde tomamos el aire?', 'por la nariz'],
      ['Al espirar, ¿por dónde sacamos el aire poco a poco?', 'por la boca'],
    ])
  })

  it('«la boca» nunca es una opción equivocada cuando se pregunta por dónde entra el aire (entra por la nariz o por la boca)', () => {
    for (const e of ejercicios('respirar')) {
      if (/entra(r)? el aire/.test(e.question)) {
        for (const opcion of e.options.filter((o) => /boca/.test(o))) expect(opcion, e.question).toBe(e.answer)
      }
    }
  })

  it('la tráquea y el esófago no se confunden: la tráquea es el tubo del aire', () => {
    for (const e of ejercicios('respirar')) {
      if (/tubo/.test(e.question)) expect(e.answer, e.question).toMatch(/tráquea/)
    }
  })
})
