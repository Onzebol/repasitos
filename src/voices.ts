// Voces de la síntesis de voz del navegador: cuáles hay en español y cuáles suenan mejor.
// La usa la página de pruebas #/voces para elegir la voz de la lectura en voz alta.

export type VoiceQuality = 'natural' | 'google' | 'normal'

const RANK: Record<VoiceQuality, number> = { natural: 0, google: 1, normal: 2 }

// Las voces neuronales de Edge se llaman «… Online (Natural)»; las de Chrome, «Google …»
export function quality(voice: SpeechSynthesisVoice): VoiceQuality {
  if (/natural|neural/i.test(voice.name)) return 'natural'
  if (/google/i.test(voice.name)) return 'google'
  return 'normal'
}

const isSpanish = (voice: SpeechSynthesisVoice) => /^es([-_]|$)/i.test(voice.lang)
const isSpain = (voice: SpeechSynthesisVoice) => /^es[-_]es$/i.test(voice.lang)

// Voces en español, de mejor a peor: naturales, de Google y normales; a igual calidad, primero es-ES
export function spanishVoices(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices
    .filter(isSpanish)
    .sort(
      (a, b) =>
        RANK[quality(a)] - RANK[quality(b)] ||
        Number(isSpain(b)) - Number(isSpain(a)) ||
        a.name.localeCompare(b.name),
    )
}

export const describeVoice = (voice: SpeechSynthesisVoice) =>
  `${voice.lang} · ${voice.localService ? 'en el dispositivo' : 'en línea'}`

export type SpeakOptions = { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number }

// Lee un texto con la voz y los ajustes indicados (para probar; la lectura normal es speak.ts)
export function speakWith(text: string, { voice, rate = 1, pitch = 1 }: SpeakOptions = {}) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice?.lang ?? 'es-ES'
  if (voice) utterance.voice = voice
  utterance.rate = rate
  utterance.pitch = pitch
  window.speechSynthesis.speak(utterance)
}
