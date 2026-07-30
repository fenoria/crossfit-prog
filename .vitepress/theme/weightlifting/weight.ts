import type { WeightliftingMove } from './types'

export function getLiftWeight(
  max: number,
  rounds: number,
  reps: number,
  move: WeightliftingMove,
): string {
  const percent =
    reps >= 6
      ? move['6']
      : reps >= 4
        ? move['4']
        : reps === 3
          ? move['3']
          : reps === 2
            ? move['2']
            : reps === 1
              ? move['1']
              : null

  if (percent === null) return '/'

  const decreasePercent = rounds >= 7 ? 15 : rounds >= 5 ? 10 : rounds >= 2 ? 5 : 0

  let weight = Math.round((max * percent) / 100)

  if (decreasePercent) {
    weight -= Math.round((weight * decreasePercent) / 100)
  }

  return `${weight} kg`
}
