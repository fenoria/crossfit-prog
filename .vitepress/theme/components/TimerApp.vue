<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import WorkoutTimer from './WorkoutTimer.vue'
import { timeToSeconds } from '../timer/time'
import type { TimerConfig, TimerType } from '../composables/useWorkoutTimer'

const types: { value: TimerType; label: string }[] = [
  { value: 'forTime', label: 'For Time' },
  { value: 'amrap', label: 'AMRAP' },
  { value: 'tabata', label: 'Tabata' },
  { value: 'emom', label: 'EMOM' },
  { value: 'chrono', label: 'Chrono' },
  { value: 'countdown', label: 'Countdown' },
]

function restoreFromStorage<T extends string | number | boolean>(
  refVariable: Ref<T>,
  storageKey: string,
) {
  const stored = localStorage.getItem(storageKey)
  if (stored === null) return

  if (typeof refVariable.value === 'boolean') {
    refVariable.value = (stored === 'true') as T
  } else if (typeof refVariable.value === 'number') {
    const n = Number(stored)
    if (!Number.isNaN(n)) refVariable.value = n as T
  } else {
    refVariable.value = stored as T
  }
}

function watchAndStoreRef<T extends string | number | boolean>(
  refVariable: Ref<T>,
  storageKey: string,
) {
  watch(refVariable, (newValue) => {
    localStorage.setItem(storageKey, String(newValue))
  })
}

const timerType = ref<TimerType>('forTime')
const timerTotalTime = ref('10:00')
const timerTotalRounds = ref(8)
const timerTabataRoundTime = ref(20)
const timerTabataRoundRestTime = ref(10)
const timerEmomRoundTime = ref(60)
const timerEmomRoundRestTime = ref(0)
const timerLauncherTime = ref(0)
const hasAudio = ref(false)
const isRunning = ref(false)

onMounted(() => {
  restoreFromStorage(timerType, 'timerType')
  restoreFromStorage(timerTotalTime, 'timerTotalTime')
  restoreFromStorage(timerTotalRounds, 'timerTotalRounds')
  restoreFromStorage(timerTabataRoundTime, 'timerTabataRoundTime')
  restoreFromStorage(timerTabataRoundRestTime, 'timerTabataRoundRestTime')
  restoreFromStorage(timerEmomRoundTime, 'timerEmomRoundTime')
  restoreFromStorage(timerEmomRoundRestTime, 'timerEmomRoundRestTime')
  restoreFromStorage(timerLauncherTime, 'timerLauncherTime')
  restoreFromStorage(hasAudio, 'hasAudio')
})

watchAndStoreRef(timerType, 'timerType')
watchAndStoreRef(timerTotalTime, 'timerTotalTime')
watchAndStoreRef(timerTotalRounds, 'timerTotalRounds')
watchAndStoreRef(timerTabataRoundTime, 'timerTabataRoundTime')
watchAndStoreRef(timerTabataRoundRestTime, 'timerTabataRoundRestTime')
watchAndStoreRef(timerEmomRoundTime, 'timerEmomRoundTime')
watchAndStoreRef(timerEmomRoundRestTime, 'timerEmomRoundRestTime')
watchAndStoreRef(timerLauncherTime, 'timerLauncherTime')
watchAndStoreRef(hasAudio, 'hasAudio')

const activeConfig = computed<TimerConfig>(() => ({
  type: timerType.value,
  launcherTime: Number(timerLauncherTime.value) || 0,
  hasAudio: hasAudio.value,
  totalTime: ['amrap', 'countdown'].includes(timerType.value)
    ? timeToSeconds(timerTotalTime.value)
    : null,
  totalRounds: ['forTime', 'emom', 'tabata'].includes(timerType.value)
    ? Number(timerTotalRounds.value) || null
    : null,
  roundTime:
    timerType.value === 'tabata'
      ? Number(timerTabataRoundTime.value) || null
      : timerType.value === 'emom'
        ? Number(timerEmomRoundTime.value) || null
        : null,
  roundRestTime:
    timerType.value === 'tabata'
      ? Number(timerTabataRoundRestTime.value) || null
      : timerType.value === 'emom'
        ? Number(timerEmomRoundRestTime.value) || null
        : null,
}))

function openTimer() {
  isRunning.value = true
}

function closeTimer() {
  isRunning.value = false
}
</script>

<template>
  <div class="timer-app">
    <WorkoutTimer
      v-if="isRunning"
      v-bind="activeConfig"
      @close="closeTimer"
    />

    <section class="timer-panel concept-figure">

      <div class="timer-form">
        <label class="timer-field">
          <span>Type</span>
          <select v-model="timerType">
            <option v-for="t in types" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
        </label>

        <label class="timer-field">
          <span>Pre-count (s)</span>
          <input v-model.number="timerLauncherTime" type="number" min="0" />
        </label>

        <label
          v-if="['amrap', 'countdown'].includes(timerType)"
          class="timer-field"
        >
          <span>Durée (mm:ss ou secondes)</span>
          <input v-model="timerTotalTime" type="text" placeholder="10:00" />
        </label>

        <label
          v-if="['forTime', 'emom', 'tabata'].includes(timerType)"
          class="timer-field"
        >
          <span>Rounds</span>
          <input v-model.number="timerTotalRounds" type="number" min="1" />
        </label>

        <template v-if="timerType === 'tabata'">
          <label class="timer-field">
            <span>Work (s)</span>
            <input v-model.number="timerTabataRoundTime" type="number" min="1" />
          </label>
          <label class="timer-field">
            <span>Rest (s)</span>
            <input
              v-model.number="timerTabataRoundRestTime"
              type="number"
              min="0"
            />
          </label>
        </template>

        <template v-if="timerType === 'emom'">
          <label class="timer-field">
            <span>Intervalle (s)</span>
            <input v-model.number="timerEmomRoundTime" type="number" min="1" />
          </label>
          <label class="timer-field">
            <span>Rest (s)</span>
            <input
              v-model.number="timerEmomRoundRestTime"
              type="number"
              min="0"
            />
          </label>
        </template>

        <label class="timer-field timer-field--checkbox">
          <input v-model="hasAudio" type="checkbox" />
          <span>Son en fin de phase</span>
        </label>

        <button type="button" class="timer-launch" @click="openTimer">
          Lancer le timer
        </button>
      </div>
    </section>
  </div>
</template>
