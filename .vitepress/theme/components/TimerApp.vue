<script setup lang="ts">
import { computed, ref } from 'vue'
import WorkoutTimer from './WorkoutTimer.vue'
import { timeToSeconds } from '../timer/time'
import type { TimerConfig, TimerType } from '../composables/useWorkoutTimer'
import { useToolStorage } from '../composables/useToolStorage'
import { primeTimerAudio } from '../timer/audio'

const types: { value: TimerType; label: string }[] = [
  { value: 'forTime', label: 'For Time' },
  { value: 'amrap', label: 'AMRAP' },
  { value: 'tabata', label: 'Tabata' },
  { value: 'emom', label: 'EMOM' },
  { value: 'chrono', label: 'Chrono' },
  { value: 'countdown', label: 'Countdown' },
]

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

useToolStorage(timerType, 'timer:type')
useToolStorage(timerTotalTime, 'timer:totalTime')
useToolStorage(timerTotalRounds, 'timer:totalRounds')
useToolStorage(timerTabataRoundTime, 'timer:tabataRoundTime')
useToolStorage(timerTabataRoundRestTime, 'timer:tabataRoundRestTime')
useToolStorage(timerEmomRoundTime, 'timer:emomRoundTime')
useToolStorage(timerEmomRoundRestTime, 'timer:emomRoundRestTime')
useToolStorage(timerLauncherTime, 'timer:launcherTime')
useToolStorage(hasAudio, 'timer:hasAudio')

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
  if (hasAudio.value) primeTimerAudio()
  isRunning.value = true
}

function closeTimer() {
  isRunning.value = false
}
</script>

<template>
  <div class="tool-app">
    <WorkoutTimer
      v-if="isRunning"
      v-bind="activeConfig"
      @close="closeTimer"
    />

    <section class="tool-panel">
      <div class="tool-form tool-form--timer">
        <div class="tool-pills" role="group" aria-label="Type de timer">
          <button
            v-for="t in types"
            :key="t.value"
            type="button"
            class="tool-pill"
            :class="{ 'tool-pill--active': timerType === t.value }"
            @click="timerType = t.value"
          >
            {{ t.label }}
          </button>
        </div>

        <label class="tool-field">
          <span>Pre-count (s)</span>
          <input v-model.number="timerLauncherTime" type="number" min="0" />
        </label>

        <label
          v-if="['amrap', 'countdown'].includes(timerType)"
          class="tool-field"
        >
          <span>Durée (mm:ss ou secondes)</span>
          <input v-model="timerTotalTime" type="text" placeholder="10:00" />
        </label>

        <label
          v-if="['forTime', 'emom', 'tabata'].includes(timerType)"
          class="tool-field"
        >
          <span>Rounds</span>
          <input v-model.number="timerTotalRounds" type="number" min="1" />
        </label>

        <template v-if="timerType === 'tabata'">
          <label class="tool-field">
            <span>Work (s)</span>
            <input v-model.number="timerTabataRoundTime" type="number" min="1" />
          </label>
          <label class="tool-field">
            <span>Rest (s)</span>
            <input
              v-model.number="timerTabataRoundRestTime"
              type="number"
              min="0"
            />
          </label>
        </template>

        <template v-if="timerType === 'emom'">
          <label class="tool-field">
            <span>Intervalle (s)</span>
            <input v-model.number="timerEmomRoundTime" type="number" min="1" />
          </label>
          <label class="tool-field">
            <span>Rest (s)</span>
            <input
              v-model.number="timerEmomRoundRestTime"
              type="number"
              min="0"
            />
          </label>
        </template>

        <label class="tool-field tool-field--checkbox">
          <input v-model="hasAudio" type="checkbox" />
          <span>Activer le son</span>
        </label>

        <button type="button" class="tool-action" @click="openTimer">
          Lancer le timer
        </button>
      </div>
    </section>
  </div>
</template>
