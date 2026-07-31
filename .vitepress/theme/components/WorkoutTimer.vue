<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import {
  ListOrdered,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  X,
} from '@lucide/vue'
import {
  useWorkoutTimer,
  type TimerConfig,
  type TimerType,
} from '../composables/useWorkoutTimer'
import { formatDiff } from '../timer/time'
import WorkoutTimerFireflies from './WorkoutTimerFireflies.vue'

const ROUND_RING_R = 34
const ROUND_RING_CIRC = 2 * Math.PI * ROUND_RING_R

const props = defineProps({
  type: { type: String as PropType<TimerType>, required: true },
  totalTime: { type: Number as PropType<number | null>, default: null },
  totalRounds: { type: Number as PropType<number | null>, default: null },
  roundTime: { type: Number as PropType<number | null>, default: null },
  roundRestTime: { type: Number as PropType<number | null>, default: null },
  launcherTime: { type: Number, default: 0 },
  hasAudio: { type: Boolean, default: false },
}) satisfies TimerConfig

const emit = defineEmits(['close'])

const timer = useWorkoutTimer(props)

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
})
onBeforeUnmount(() => {
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
    <WorkoutTimerFireflies />

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
                  {{ formatDiff(round.diff) }}
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
