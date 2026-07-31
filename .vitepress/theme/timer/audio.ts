export type TimerSound = 'work' | 'rest' | 'round' | 'segment'

let audioCtx: AudioContext | null = null
let dingAudio: HTMLAudioElement | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

function beep(frequency: number, duration: number, volume = 0.3) {
  const ctx = getContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.frequency.value = frequency
  oscillator.type = 'sine'
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

function playDing() {
  if (!dingAudio) {
    dingAudio = new Audio(`${import.meta.env.BASE_URL}sounds/ding.mp3`)
  }
  dingAudio.currentTime = 0
  dingAudio.play().catch(() => {})
}

export function playTimerSound(kind: TimerSound, enabled: boolean) {
  if (!enabled) return

  switch (kind) {
    case 'work':
      beep(880, 0.12)
      break
    case 'rest':
      beep(440, 0.15)
      break
    case 'round':
      beep(660, 0.08, 0.25)
      break
    case 'segment':
      playDing()
      break
  }
}
