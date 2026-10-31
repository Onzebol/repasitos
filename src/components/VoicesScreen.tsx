import { useState, useSyncExternalStore } from 'react'
import { describeVoice, quality, spanishVoices, speakWith } from '../voices'
import type { VoiceQuality } from '../voices'
import { Hills } from './Hills'
import { Icon } from './Icon'
import { TopBar } from './TopBar'

type VoicesScreenProps = {
  onHome: () => void
}

// Frases reales de la aplicación para comparar las voces
const EJEMPLOS = [
  { nombre: 'Infantil', texto: 'Cuenta los animales y toca el número que dice cuántos hay' },
  { nombre: 'Números', texto: 'Uno, dos, tres, cuatro, cinco, seis, siete' },
  { nombre: 'Primaria', texto: 'Suma las decenas y las unidades. ¡Casi! Inténtalo otra vez' },
]

const ETIQUETA: Record<VoiceQuality, string> = {
  natural: 'Natural',
  google: 'Google',
  normal: 'Del sistema',
}

// Las voces pueden cargarse después de abrir la página: el navegador avisa con «voiceschanged»
const subscribe = (onChange: () => void) => {
  if (!('speechSynthesis' in window)) return () => {}
  const synth = window.speechSynthesis
  synth.addEventListener('voiceschanged', onChange)
  return () => synth.removeEventListener('voiceschanged', onChange)
}
const emptyVoices: SpeechSynthesisVoice[] = []
let lastVoices: SpeechSynthesisVoice[] = emptyVoices
let lastSource: SpeechSynthesisVoice[] | undefined

// useSyncExternalStore pide el mismo valor mientras no cambie: se conserva la lista ordenada de la última lectura
const getVoices = () => {
  const source = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : emptyVoices
  if (source.length !== lastSource?.length || source.some((v, i) => v !== lastSource?.[i])) {
    lastSource = [...source]
    lastVoices = spanishVoices(source)
  }
  return lastVoices
}

// Página para adultos (#/voces, sin botón en el inicio): oír las voces en español del dispositivo con distinta
// velocidad y tono, para elegir cuál usar en la lectura en voz alta. No guarda ni envía nada.
export function VoicesScreen({ onHome }: VoicesScreenProps) {
  const voices = useSyncExternalStore(subscribe, getVoices)
  const [text, setText] = useState(EJEMPLOS[0].texto)
  const [rate, setRate] = useState(0.9)
  const [pitch, setPitch] = useState(1)

  return (
    <main className="screen trace-page">
      <Hills />
      <TopBar title="Voces" prompt={text} onHome={onHome} />
      <div className="trace-content voices-content">
        <section className="voices-card" aria-labelledby="voces-texto">
          <h2 id="voces-texto">Texto de prueba</h2>
          <div className="voices-examples" role="group" aria-label="Frases de ejemplo">
            {EJEMPLOS.map((ejemplo) => (
              <button key={ejemplo.nombre} className="trace-try voices-chip" onClick={() => setText(ejemplo.texto)}>
                {ejemplo.nombre}
              </button>
            ))}
          </div>
          <label className="voices-field">
            <span>Texto</span>
            <textarea value={text} rows={2} onChange={(event) => setText(event.target.value)} />
          </label>
          <label className="voices-field">
            <span>Velocidad ({rate.toFixed(2)})</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </label>
          <label className="voices-field">
            <span>Tono ({pitch.toFixed(1)})</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(event) => setPitch(Number(event.target.value))}
            />
          </label>
        </section>

        <section className="voices-card" aria-labelledby="voces-navegador">
          <h2 id="voces-navegador">Voces del navegador</h2>
          {voices.length === 0 ? (
            <p>
              No hay voces en español en este dispositivo (o todavía se están cargando). Prueba en otro navegador, por
              ejemplo Edge, que trae voces «Natural».
            </p>
          ) : (
            <ul className="voices-list" aria-label="Voces en español">
              {voices.map((voice) => (
                <li key={`${voice.name}|${voice.lang}`}>
                  <button
                    className="round-button"
                    onClick={() => speakWith(text, { voice, rate, pitch })}
                    aria-label={`Escuchar con ${voice.name}`}
                  >
                    <Icon name="sound" />
                  </button>
                  <span className="voices-name">{voice.name}</span>
                  <small>
                    {ETIQUETA[quality(voice)]} · {describeVoice(voice)}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
