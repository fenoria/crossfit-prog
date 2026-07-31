export type FireflyDrift = 'a' | 'b' | 'c' | 'd' | 'e'

export interface FireflyConfig {
  top: string
  left: string
  rgb: string
  size: number
  drift: FireflyDrift
  driftDuration: number
  driftDelay: number
  twinkle: number
  twinkleDelay: number
  swayDuration: number
  swayDelay: number
}

const FIREFLY_COUNT = 12

const FIREFLY_POSITIONS: [number, number][] = [
  [8, 10], [14, 82], [22, 48], [10, 92], [36, 6],
  [44, 68], [52, 28], [48, 88], [66, 16], [72, 74],
  [28, 58], [84, 40],
]

const FIREFLY_BLUEPRINTS: Omit<
  FireflyConfig,
  'top' | 'left' | 'swayDuration' | 'swayDelay'
>[] = [
  { rgb: '100, 255, 218', size: 2, drift: 'a', driftDuration: 26, driftDelay: -4, twinkle: 5.8, twinkleDelay: -2.1 },
  { rgb: '255, 224, 130', size: 3, drift: 'c', driftDuration: 28, driftDelay: -12, twinkle: 6.6, twinkleDelay: -4.6 },
  { rgb: '200, 170, 255', size: 2, drift: 'e', driftDuration: 23, driftDelay: -18, twinkle: 5.2, twinkleDelay: -1.2 },
  { rgb: '180, 255, 210', size: 2, drift: 'b', driftDuration: 27, driftDelay: -8, twinkle: 6.1, twinkleDelay: -3.2 },
  { rgb: '255, 224, 130', size: 3, drift: 'd', driftDuration: 22, driftDelay: -22, twinkle: 7.2, twinkleDelay: -5.8 },
  { rgb: '130, 220, 180', size: 2, drift: 'd', driftDuration: 25, driftDelay: -14, twinkle: 5.6, twinkleDelay: -2.5 },
  { rgb: '230, 245, 255', size: 2, drift: 'a', driftDuration: 24, driftDelay: -26, twinkle: 4.9, twinkleDelay: -4.8 },
  { rgb: '200, 170, 255', size: 2, drift: 'c', driftDuration: 27, driftDelay: -16, twinkle: 6.4, twinkleDelay: -2.9 },
  { rgb: '100, 255, 218', size: 3, drift: 'e', driftDuration: 21, driftDelay: -10, twinkle: 5.9, twinkleDelay: -3.7 },
  { rgb: '180, 255, 210', size: 2, drift: 'b', driftDuration: 24, driftDelay: -28, twinkle: 5.3, twinkleDelay: -1.5 },
  { rgb: '255, 224, 130', size: 2, drift: 'a', driftDuration: 29, driftDelay: -20, twinkle: 7.4, twinkleDelay: -6.4 },
  { rgb: '100, 255, 218', size: 3, drift: 'd', driftDuration: 23, driftDelay: -6, twinkle: 5.5, twinkleDelay: -2.3 },
  { rgb: '230, 245, 255', size: 2, drift: 'c', driftDuration: 26, driftDelay: -32, twinkle: 5.1, twinkleDelay: -4.2 },
  { rgb: '200, 170, 255', size: 2, drift: 'b', driftDuration: 22, driftDelay: -24, twinkle: 6.8, twinkleDelay: -5.1 },
  { rgb: '130, 220, 180', size: 3, drift: 'e', driftDuration: 25, driftDelay: -12, twinkle: 5.8, twinkleDelay: -3.4 },
  { rgb: '180, 255, 210', size: 2, drift: 'c', driftDuration: 21, driftDelay: -30, twinkle: 4.8, twinkleDelay: -5.9 },
  { rgb: '255, 224, 130', size: 2, drift: 'a', driftDuration: 27, driftDelay: -18, twinkle: 6.9, twinkleDelay: -1.8 },
  { rgb: '100, 255, 218', size: 3, drift: 'd', driftDuration: 26, driftDelay: -8, twinkle: 5.7, twinkleDelay: -4.1 },
  { rgb: '200, 170, 255', size: 2, drift: 'b', driftDuration: 28, driftDelay: -36, twinkle: 7.1, twinkleDelay: -7.2 },
  { rgb: '230, 245, 255', size: 2, drift: 'e', driftDuration: 23, driftDelay: -14, twinkle: 4.7, twinkleDelay: -0.8 },
]

const FIREFLY_TEMPO = 0.9

export function buildFireflies(): FireflyConfig[] {
  return Array.from({ length: FIREFLY_COUNT }, (_, i) => {
    const slot = FIREFLY_POSITIONS[i]
    const blueprint = FIREFLY_BLUEPRINTS[i % FIREFLY_BLUEPRINTS.length]

    return {
      ...blueprint,
      size: blueprint.size + 1,
      top: `${slot[0]}%`,
      left: `${slot[1]}%`,
      driftDuration: Math.round(blueprint.driftDuration * FIREFLY_TEMPO),
      twinkle: Math.round(blueprint.twinkle * FIREFLY_TEMPO * 10) / 10,
      swayDuration: Math.round((28 + (i % 5) * 6) * FIREFLY_TEMPO),
      swayDelay: -(i * 2.7),
    }
  })
}
