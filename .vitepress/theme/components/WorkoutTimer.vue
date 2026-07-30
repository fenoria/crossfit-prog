<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  X,
} from '@lucide/vue'
import { useWorkoutTimer } from '../composables/useWorkoutTimer'

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

onMounted(() => timer.init())
onBeforeUnmount(() => timer.dispose())
</script>

<template>
  <div class="workout-timer">
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
        type="button"
        class="timer-btn"
        title="Retour à la configuration"
        @click="emit('close')"
      >
        <X aria-hidden="true" />
      </button>
    </div>

    <button
      v-if="timer.showRoundButton.value"
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

      <div
        v-if="timer.showSplitsTable.value && timer.rounds.value.length"
        class="tool-table"
      >
        <table>
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
              v-for="(round, index) in timer.rounds.value.slice().reverse()"
              :key="timer.rounds.value.length - index"
            >
              <td>{{ timer.rounds.value.length - index }}</td>
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
  </div>
</template>
