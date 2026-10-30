// Lee un texto en voz alta con la síntesis de voz del navegador (sin servidores ni datos)
export function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  utterance.rate = 0.9
  window.speechSynthesis.speak(utterance)
}
