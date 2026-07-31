export type TimerSound = 'work' | 'rest' | 'round' | 'segment'

const SOUND_URL = `${import.meta.env.BASE_URL}sounds/ding.mp3`

const SOUND_VARIANTS: Record<
  Exclude<TimerSound, 'segment'>,
  { playbackRate: number; volume: number }
> = {
  work: { playbackRate: 1.35, volume: 1 },
  rest: { playbackRate: 0.72, volume: 1 },
  round: { playbackRate: 1.65, volume: 0.85 },
}

let primed = false

function playClip(playbackRate: number, volume: number) {
  const audio = new Audio(SOUND_URL)
  audio.playbackRate = playbackRate
  audio.volume = volume
  audio.play().catch(() => {})
}

/** Débloque la lecture audio (iOS / autoplay) — appeler sur geste utilisateur. */
export function primeTimerAudio() {
  if (primed || typeof window === 'undefined') return

  const audio = new Audio(SOUND_URL)
  audio.volume = 0.001
  audio
    .play()
    .then(() => {
      audio.pause()
      primed = true
    })
    .catch(() => {})
}

export function playTimerSound(kind: TimerSound, enabled: boolean) {
  if (!enabled) return

  if (kind === 'segment') {
    playClip(1, 1)
    return
  }

  const variant = SOUND_VARIANTS[kind]
  playClip(variant.playbackRate, variant.volume)
}
