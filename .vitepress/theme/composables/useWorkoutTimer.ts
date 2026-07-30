import { computed, ref, type Ref } from 'vue'
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

export function useWorkoutTimer(config: TimerConfig) {
  const audioDing = new Audio(`${import.meta.env.BASE_URL}sounds/ding.mp3`)

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
    ['amrap', 'countdown', 'tabata', 'emom', 'launcher'].includes(
      currentTimer.value.type ?? '',
    )

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
    let count = ['forTime', 'amrap'].includes(type)
      ? rounds.value.length
      : rounds.value.length + 1

    if (
      ['tabata', 'emom'].includes(type) &&
      currentTimer.value.isRest
    ) {
      count = rounds.value.length
    }

    if (config.totalRounds && config.totalRounds > 0) {
      return Math.min(count, config.totalRounds)
    }
    return count
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
    if (
      document.visibilityState === 'visible' &&
      timerStatus.value === 'started'
    ) {
      startWakeLock()
    }
  }

  const tick = () => {
    animationFrame = requestAnimationFrame(() => {
      const fractionalElapsed =
        (performance.now() - (startedAt ?? 0)) / 1000 + elapsedOffset
      elapsedTime.value = Math.floor(fractionalElapsed)
      updateSegmentProgress(fractionalElapsed)

      const keepRunning =
        (isDownType() && (remainingTime.value ?? 0) > 0) ||
        (currentTimer.value.type === 'forTime' &&
          rounds.value.length < (config.totalRounds ?? 0)) ||
        currentTimer.value.type === 'chrono'

      if (keepRunning) {
        tick()
      } else {
        if (currentTimer.value.totalTime) {
          segmentProgress.value = 1
        }
        if (
          ['tabata', 'emom'].includes(currentTimer.value.type ?? '') &&
          !currentTimer.value.isRest
        ) {
          addSplitTime()
        } else if (shouldAddFinalSplit()) {
          addSplitTime()
        }

        if (config.hasAudio) {
          audioDing.play().catch(() => {})
        }

        stopTimer()
        if (setCurrentTimer()) startTimer()
        else stopTimer('ended')
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
    timerStatus.value = status
    elapsedOffset = elapsedTime.value
    startedAt = null
  }

  const resetTimer = (status: 'ready' | 'ended' = 'ready') => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    setTimerQueue()
    setCurrentTimer()
    rounds.value = []
    startedAt = null
    timerStatus.value = status
    elapsedOffset = 0
  }

  const togglePlayPause = () => {
    if (timerStatus.value === 'ready') startTimer()
    else if (timerStatus.value === 'started') stopTimer()
    else if (timerStatus.value === 'stopped') startTimer()
    else if (timerStatus.value === 'ended') {
      resetTimer()
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
    addSplitTime()
  }

  const startFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } catch {
      /* ignore */
    }
  }

  const stopFullscreen = () => {
    if (isFullscreen.value) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }

  const init = () => {
    resetTimer()
    startWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  const dispose = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
    stopFullscreen()
    stopWakeLock()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
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
