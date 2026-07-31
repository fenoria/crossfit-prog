import { computed, ref, type Ref } from 'vue'
import { playTimerSound, primeTimerAudio } from '../timer/audio'
import { getStringTime } from '../timer/time'

export type TimerType =
  | 'forTime'
  | 'amrap'
  | 'tabata'
  | 'emom'
  | 'chrono'
  | 'countdown'

export interface TimerConfig {
  type: TimerType
  totalTime: number | null
  totalRounds: number | null
  roundTime: number | null
  roundRestTime: number | null
  launcherTime: number
  hasAudio: boolean
}

export interface RoundSplit {
  elapsedTime: number
  roundTime: number
  diff: number
}

interface QueueItem {
  type: string
  time: number | null
  isRest?: boolean
}

const DOWN_TYPES = ['amrap', 'countdown', 'tabata', 'emom', 'launcher'] as const
const INTERVAL_TYPES = ['tabata', 'emom'] as const

export function useWorkoutTimer(config: TimerConfig) {
  let animationFrame: number | undefined
  let wakeLock: WakeLockSentinel | null = null
  let timerQueue: QueueItem[] = []
  let startedAt: number | null = null
  let elapsedOffset = 0

  const isFullscreen = ref(false)
  const timerStatus = ref<'ready' | 'started' | 'stopped' | 'ended'>('ready')
  const elapsedTime = ref(0)
  const segmentProgress = ref<number | null>(null)
  const rounds: Ref<RoundSplit[]> = ref([])

  const currentTimer = ref<{
    type: string | null
    totalTime: number | null
    isRest: boolean | null
  }>({
    type: null,
    totalTime: null,
    isRest: null,
  })

  const isDownType = () =>
    DOWN_TYPES.includes(currentTimer.value.type as (typeof DOWN_TYPES)[number])

  const getFractionalElapsed = () =>
    (performance.now() - (startedAt ?? 0)) / 1000 + elapsedOffset

  const remainingTime = computed(() => {
    if (!currentTimer.value.totalTime) return null
    return Math.max(currentTimer.value.totalTime - elapsedTime.value, 0)
  })

  const displayedTime = computed(() =>
    isDownType() ? remainingTime.value : elapsedTime.value,
  )

  const formattedTime = computed(() =>
    getStringTime(displayedTime.value, false),
  )

  const isLastSeconds = computed(
    () =>
      ['amrap', 'countdown'].includes(currentTimer.value.type ?? '') &&
      (displayedTime.value ?? 0) <= 5,
  )

  const displayRound = computed(() => {
    const type = currentTimer.value.type ?? ''

    if (type === 'amrap') {
      return rounds.value.length
    }

    if (['tabata', 'emom', 'forTime'].includes(type)) {
      const current = rounds.value.length + 1
      if (config.totalRounds && config.totalRounds > 0) {
        return Math.min(current, config.totalRounds)
      }
      return current
    }

    return rounds.value.length
  })

  const showRoundButton = computed(() =>
    ['amrap', 'forTime', 'tabata', 'emom'].includes(
      currentTimer.value.type ?? '',
    ),
  )

  const showSplitsTable = computed(() =>
    ['forTime', 'amrap'].includes(currentTimer.value.type ?? ''),
  )

  const timeClass = computed(() => {
    if (currentTimer.value.isRest) return 'timer-time--rest'
    if (currentTimer.value.type === 'launcher') return 'timer-time--launcher'
    if (isLastSeconds.value) return 'timer-time--urgent'
    return 'timer-time--normal'
  })

  const roundProgress = computed(() => {
    if (!config.totalRounds || config.totalRounds <= 0) return null
    return Math.min(displayRound.value / config.totalRounds, 1)
  })

  const setTimerQueue = () => {
    timerQueue = []

    if (config.launcherTime) {
      timerQueue.push({ type: 'launcher', time: config.launcherTime })
    }

    if (['amrap', 'countdown'].includes(config.type)) {
      timerQueue.push({ type: config.type, time: config.totalTime })
    }

    if (['forTime', 'chrono'].includes(config.type)) {
      timerQueue.push({ type: config.type, time: null })
    }

    if (['tabata', 'emom'].includes(config.type) && config.totalRounds) {
      for (let index = 0; index < config.totalRounds; index++) {
        timerQueue.push({
          type: config.type,
          time: config.roundTime,
        })

        if (config.roundRestTime && index < config.totalRounds - 1) {
          timerQueue.push({
            type: config.type,
            time: config.roundRestTime,
            isRest: true,
          })
        }
      }
    }
  }

  const setCurrentTimer = () => {
    if (!timerQueue.length) return false
    const current = timerQueue.shift()!

    currentTimer.value = {
      type: current.type,
      totalTime: current.time,
      isRest: current.isRest ?? null,
    }

    elapsedTime.value = 0
    elapsedOffset = 0
    segmentProgress.value = 0
    return true
  }

  const updateSegmentProgress = (fractionalElapsed: number) => {
    const total = currentTimer.value.totalTime
    if (!total || total <= 0) {
      segmentProgress.value = null
      return
    }
    segmentProgress.value = Math.min(fractionalElapsed / total, 1)
  }

  const addSplitTime = () => {
    const roundTime =
      elapsedTime.value -
      (rounds.value.length
        ? rounds.value[rounds.value.length - 1].elapsedTime
        : 0)
    const diff = rounds.value.length
      ? roundTime - rounds.value[rounds.value.length - 1].roundTime
      : 0

    rounds.value.push({ elapsedTime: elapsedTime.value, roundTime, diff })
  }

  const shouldAddFinalSplit = () => {
    const type = currentTimer.value.type ?? ''
    if (type !== 'forTime' || elapsedTime.value <= 0) {
      return false
    }

    if (
      type === 'forTime' &&
      config.totalRounds &&
      rounds.value.length >= config.totalRounds
    ) {
      return false
    }

    if (!rounds.value.length) return true

    return (
      elapsedTime.value > rounds.value[rounds.value.length - 1].elapsedTime
    )
  }

  const shouldKeepRunning = (fractionalElapsed: number) => {
    const type = currentTimer.value.type ?? ''

    if (DOWN_TYPES.includes(type as (typeof DOWN_TYPES)[number])) {
      const total = currentTimer.value.totalTime
      if (!total || total <= 0) return false
      return fractionalElapsed < total
    }

    if (type === 'forTime') {
      return rounds.value.length < (config.totalRounds ?? 0)
    }

    if (type === 'chrono') return true

    return false
  }

  const playSegmentTransitionSound = () => {
    const type = currentTimer.value.type ?? ''
    if (INTERVAL_TYPES.includes(type as (typeof INTERVAL_TYPES)[number])) {
      playTimerSound(
        currentTimer.value.isRest ? 'rest' : 'work',
        config.hasAudio,
      )
    } else {
      playTimerSound('segment', config.hasAudio)
    }
  }

  const finishCurrentSegment = () => {
    if (currentTimer.value.totalTime) {
      segmentProgress.value = 1
    }

    const type = currentTimer.value.type ?? ''
    if (
      INTERVAL_TYPES.includes(type as (typeof INTERVAL_TYPES)[number]) &&
      !currentTimer.value.isRest
    ) {
      addSplitTime()
    } else if (shouldAddFinalSplit()) {
      addSplitTime()
    }

    playSegmentTransitionSound()

    stopTimer()
    if (setCurrentTimer()) startTimer()
    else stopTimer('ended')
  }

  const updateFromClock = () => {
    const fractionalElapsed = getFractionalElapsed()
    elapsedTime.value = Math.floor(fractionalElapsed)
    updateSegmentProgress(fractionalElapsed)
    return fractionalElapsed
  }

  const syncFromClock = () => {
    if (timerStatus.value !== 'started' || startedAt == null) return

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = undefined
    }

    let safety = 0
    while (timerStatus.value === 'started' && safety++ < 200) {
      const fractionalElapsed = updateFromClock()
      if (shouldKeepRunning(fractionalElapsed)) {
        tick()
        return
      }
      finishCurrentSegment()
      if (timerStatus.value === 'ended') return
    }

    if (timerStatus.value === 'started' && !animationFrame) {
      tick()
    }
  }

  const startWakeLock = async () => {
    if (!('wakeLock' in navigator) || wakeLock) return
    try {
      wakeLock = await navigator.wakeLock.request('screen')
      wakeLock.addEventListener('release', () => {
        wakeLock = null
      })
    } catch {
      wakeLock = null
    }
  }

  const stopWakeLock = () => {
    if (wakeLock?.release) {
      wakeLock.release().then(() => {
        wakeLock = null
      })
    } else {
      wakeLock = null
    }
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState !== 'visible') return
    if (timerStatus.value === 'started') {
      startWakeLock()
      syncFromClock()
    }
  }

  const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
  }

  const tick = () => {
    animationFrame = requestAnimationFrame(() => {
      const fractionalElapsed = updateFromClock()

      if (shouldKeepRunning(fractionalElapsed)) {
        tick()
      } else {
        finishCurrentSegment()
      }
    })
  }

  const startTimer = () => {
    startedAt = performance.now()
    timerStatus.value = 'started'
    startWakeLock()
    tick()
  }

  const stopTimer = (status: 'stopped' | 'ended' = 'stopped') => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationFrame = undefined
    timerStatus.value = status
    elapsedOffset = elapsedTime.value
    startedAt = null
  }

  const resetTimer = (status: 'ready' | 'ended' = 'ready') => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    animationFrame = undefined
    setTimerQueue()
    setCurrentTimer()
    rounds.value = []
    startedAt = null
    timerStatus.value = status
    elapsedOffset = 0
  }

  const togglePlayPause = () => {
    if (timerStatus.value === 'ready') {
      primeTimerAudio()
      startTimer()
    } else if (timerStatus.value === 'started') stopTimer()
    else if (timerStatus.value === 'stopped') {
      primeTimerAudio()
      startTimer()
    } else if (timerStatus.value === 'ended') {
      resetTimer()
      primeTimerAudio()
      startTimer()
    }
  }

  const onClickCount = () => {
    if (
      !['forTime', 'amrap'].includes(currentTimer.value.type ?? '') ||
      timerStatus.value !== 'started'
    ) {
      return
    }
    primeTimerAudio()
    addSplitTime()
    playTimerSound('round', config.hasAudio)
  }

  const startFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      /* ignore */
    }
  }

  const stopFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }

  const init = () => {
    resetTimer()
    startWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    isFullscreen.value = !!document.fullscreenElement
  }

  const dispose = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    stopFullscreen()
    stopWakeLock()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }

  return {
    rounds,
    timerStatus,
    currentTimer,
    isFullscreen,
    formattedTime,
    displayRound,
    showRoundButton,
    showSplitsTable,
    timeClass,
    segmentProgress,
    roundProgress,
    init,
    dispose,
    togglePlayPause,
    resetTimer,
    onClickCount,
    startFullscreen,
    stopFullscreen,
    getStringTime,
  }
}
