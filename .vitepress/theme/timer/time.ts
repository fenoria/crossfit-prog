export function getStringTime(
  time: number | null | undefined,
  withUnit: boolean,
): string {
  const t = time ?? 0
  const seconds = t % 60
  const minutes = Math.floor(t / 60)
  return `${minutes.toString().padStart(2, '0')}${withUnit ? "'" : ''}${
    !withUnit ? ':' : ''
  }${seconds.toString().padStart(2, '0')}${withUnit ? "''" : ''}`
}

export function timeToSeconds(timeString: string | number): number {
  if (typeof timeString === 'number') return timeString

  const timeParts = timeString.split(':').map((part) => {
    const value = +part
    return Number.isNaN(value) ? 0 : value
  })

  let seconds = 0
  if (timeParts.length === 1) {
    seconds = timeParts[0]
  } else if (timeParts.length === 2) {
    seconds = timeParts[0] * 60 + timeParts[1]
  } else if (timeParts.length === 3) {
    seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
  }

  return Number.isNaN(seconds) ? 0 : seconds
}
