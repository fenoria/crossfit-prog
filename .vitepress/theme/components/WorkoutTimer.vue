<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ListOrdered,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  X,
} from '@lucide/vue'
import { useWorkoutTimer } from '../composables/useWorkoutTimer'

const ROUND_RING_R = 34
const ROUND_RING_CIRC = 2 * Math.PI * ROUND_RING_R

const props = defineProps({
  type: { type: String, required: true },
  totalTime: { type: Number, default: null },
  totalRounds: { type: Number, default: null },
  roundTime: { type: Number, default: null },
  roundRestTime: { type: Number, default: null },
  launcherTime: { type: Number, default: 0 },
  hasAudio: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const timer = useWorkoutTimer({
  type: props.type,
  totalTime: props.totalTime,
  totalRounds: props.totalRounds,
  roundTime: props.roundTime,
  roundRestTime: props.roundRestTime,
  launcherTime: props.launcherTime,
  hasAudio: props.hasAudio,
})

const isLauncherPhase = computed(
  () => timer.currentTimer.value.type === 'launcher',
)

const ringProgress = computed(() => {
  if (isLauncherPhase.value) return null
  if (timer.segmentProgress.value != null) return timer.segmentProgress.value
  return timer.roundProgress.value
})

const showRoundRing = computed(
  () => timer.showRoundButton.value && ringProgress.value != null,
)

const ringOffset = computed(() => {
  const progress = ringProgress.value
  if (progress == null) return ROUND_RING_CIRC
  return ROUND_RING_CIRC * (1 - progress)
})

const showBottomBar = computed(() => {
  if (timer.segmentProgress.value == null) return false
  if (isLauncherPhase.value) return true
  return !timer.showRoundButton.value
})

const splitsVisible = ref(false)

type FireflyDrift = 'a' | 'b' | 'c' | 'd' | 'e'

interface FireflyConfig {
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

const FIREFLY_POSITIONS: [number, number][] = [
  [7, 5], [12, 18], [9, 42], [15, 68], [6, 88],
  [24, 10], [28, 32], [22, 78], [38, 6], [44, 92],
  [52, 14], [48, 52], [56, 72], [62, 28], [68, 86],
  [74, 8], [78, 38], [82, 58], [88, 22], [91, 76],
  [18, 55], [35, 8], [65, 45], [33, 88], [85, 35],
  [55, 12], [72, 62], [45, 25],
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

function buildFireflies(): FireflyConfig[] {
  const viewport =
    typeof window !== 'undefined'
      ? window.innerWidth + window.innerHeight
      : 1200
  const count = Math.min(28, Math.max(18, Math.round(viewport / 120)))

  return Array.from({ length: count }, (_, i) => {
    const slot = FIREFLY_POSITIONS[i % FIREFLY_POSITIONS.length]
    const blueprint = FIREFLY_BLUEPRINTS[i % FIREFLY_BLUEPRINTS.length]
    const layer = Math.floor(i / FIREFLY_POSITIONS.length)
    const topJitter = layer > 0 ? (i % 4) * 3 - 4 : 0
    const leftJitter = layer > 0 ? (i % 3) * 4 - 4 : 0

    return {
      ...blueprint,
      size: blueprint.size + 1,
      top: `${Math.max(4, Math.min(93, slot[0] + topJitter))}%`,
      left: `${Math.max(4, Math.min(93, slot[1] + leftJitter))}%`,
      driftDuration: Math.round(blueprint.driftDuration * FIREFLY_TEMPO),
      twinkle: Math.round(blueprint.twinkle * FIREFLY_TEMPO * 10) / 10,
      swayDuration: Math.round((34 + (i % 6) * 5) * FIREFLY_TEMPO),
      swayDelay: -(i * 2.7),
    }
  })
}

const fireflies = ref<FireflyConfig[]>(buildFireflies())

function refreshFireflies() {
  fireflies.value = buildFireflies()
}

const canShowSplits = computed(
  () => timer.showSplitsTable.value && timer.rounds.value.length > 0,
)

watch(
  () => timer.timerStatus.value,
  (status) => {
    if (status === 'ready') splitsVisible.value = false
  },
)

onMounted(() => {
  timer.init()
  refreshFireflies()
  window.addEventListener('resize', refreshFireflies)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshFireflies)
  timer.dispose()
})
</script>

<template>
  <div
    class="workout-timer"
    :class="{
      'workout-timer--paused': timer.timerStatus.value === 'stopped',
      'workout-timer--ended': timer.timerStatus.value === 'ended',
    }"
  >
    <div class="workout-timer__fireflies" aria-hidden="true">
      <span
        v-for="(fly, i) in fireflies"
        :key="i"
        class="workout-timer__firefly-wrap"
        :style="{
          top: fly.top,
          left: fly.left,
          '--ff-sway-duration': `${fly.swayDuration}s`,
          '--ff-sway-delay': `${fly.swayDelay}s`,
        }"
      >
        <span
          class="workout-timer__firefly"
          :class="[
            `workout-timer__firefly--drift-${fly.drift}`,
            { 'workout-timer__firefly--large': fly.size > 3 },
          ]"
          :style="{
            '--ff-rgb': fly.rgb,
            '--ff-size': `${fly.size}px`,
            '--ff-drift-duration': `${fly.driftDuration}s`,
            '--ff-drift-delay': `${fly.driftDelay}s`,
            '--ff-twinkle': `${fly.twinkle}s`,
            '--ff-twinkle-delay': `${fly.twinkleDelay}s`,
          }"
        />
      </span>
    </div>

    <div class="workout-timer__toolbar">
      <button
        v-if="timer.isFullscreen.value"
        type="button"
        class="timer-btn"
        title="Quitter le plein écran"
        @click="timer.stopFullscreen()"
      >
        <Minimize2 aria-hidden="true" />
      </button>
      <button
        v-else
        type="button"
        class="timer-btn"
        title="Plein écran"
        @click="timer.startFullscreen()"
      >
        <Maximize2 aria-hidden="true" />
      </button>

      <button
        type="button"
        class="timer-btn"
        :class="{ 'timer-btn--active': timer.timerStatus.value === 'started' }"
        title="Lecture / Pause"
        @click="timer.togglePlayPause()"
      >
        <Pause v-if="timer.timerStatus.value === 'started'" aria-hidden="true" />
        <Play v-else aria-hidden="true" />
      </button>

      <button
        type="button"
        class="timer-btn"
        title="Réinitialiser"
        @click="timer.resetTimer()"
      >
        <RotateCcw aria-hidden="true" />
      </button>

      <button
        v-if="canShowSplits"
        type="button"
        class="timer-btn"
        :class="{ 'timer-btn--active': splitsVisible }"
        title="Consulter les splits"
        @click="splitsVisible = true"
      >
        <ListOrdered aria-hidden="true" />
      </button>

      <button
        type="button"
        class="timer-btn"
        title="Retour à la configuration"
        @click="emit('close')"
      >
        <X aria-hidden="true" />
      </button>
    </div>

    <div v-if="timer.showRoundButton.value" class="workout-timer__round-wrap">
      <svg
        v-if="showRoundRing"
        class="workout-timer__round-ring"
        viewBox="0 0 72 72"
        aria-hidden="true"
      >
        <circle
          class="workout-timer__ring-track"
          cx="36"
          cy="36"
          :r="ROUND_RING_R"
          fill="none"
        />
        <circle
          class="workout-timer__ring-fill"
          :class="timer.timeClass.value"
          cx="36"
          cy="36"
          :r="ROUND_RING_R"
          fill="none"
          :stroke-dasharray="ROUND_RING_CIRC"
          :stroke-dashoffset="ringOffset"
        />
      </svg>

      <button
        type="button"
        class="workout-timer__round"
        :class="{
          'workout-timer__round--rest': timer.currentTimer.value.isRest,
          'workout-timer__round--urgent':
            !timer.currentTimer.value.isRest &&
            timer.timeClass.value === 'timer-time--urgent',
        }"
        @click="timer.onClickCount()"
      >
        <span class="workout-timer__round-num" :class="timer.timeClass.value">
          {{ timer.displayRound.value
          }}<span v-if="props.totalRounds" class="workout-timer__round-total"
            >/{{ props.totalRounds }}</span
          >
        </span>
      </button>
    </div>

    <div class="workout-timer__main">
      <button
        type="button"
        class="workout-timer__time-btn"
        @click="timer.togglePlayPause()"
      >
        <div class="workout-timer__time" :class="timer.timeClass.value">
          {{ timer.formattedTime.value }}
        </div>
      </button>
    </div>

    <div
      v-if="canShowSplits && splitsVisible"
      class="workout-timer__splits"
    >
      <div class="workout-timer__splits-header">
        <span class="workout-timer__splits-title">Splits</span>
        <button
          type="button"
          class="timer-btn"
          title="Fermer"
          @click="splitsVisible = false"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <div class="workout-timer__splits-body">
        <table class="workout-timer__splits-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cumul</th>
              <th>Split</th>
              <th>Δ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(round, index) in timer.rounds.value"
              :key="index + 1"
              :class="{
                'workout-timer__splits-row--latest':
                  index === timer.rounds.value.length - 1,
              }"
            >
              <td>{{ index + 1 }}</td>
              <td>
                {{ timer.getStringTime(round.elapsedTime, true) }}
              </td>
              <td>{{ timer.getStringTime(round.roundTime, true) }}</td>
              <td>
                <span
                  :class="
                    round.diff > 0
                      ? 'workout-timer__diff--slow'
                      : 'workout-timer__diff--fast'
                  "
                >
                  {{ round.diff > 0 ? `+${round.diff}` : round.diff }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showBottomBar" class="workout-timer__bar" aria-hidden="true">
      <div
        class="workout-timer__bar-fill"
        :class="timer.timeClass.value"
        :style="{ transform: `scaleX(${timer.segmentProgress.value})` }"
      />
    </div>
  </div>
</template>
