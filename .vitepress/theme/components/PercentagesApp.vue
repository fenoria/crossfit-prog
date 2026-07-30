<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToolStorage } from '../composables/useToolStorage'

const baseWeight = ref(100)
const maxPercent = ref(100)
const minPercent = ref(30)
const increment = ref(5)

useToolStorage(baseWeight, 'pct:baseWeight')
useToolStorage(maxPercent, 'pct:maxPercent')
useToolStorage(minPercent, 'pct:minPercent')
useToolStorage(increment, 'pct:increment')

const percents = computed(() => {
  const inc = increment.value || 1
  const rows = Math.ceil((maxPercent.value - minPercent.value + 1) / inc)
  return Array.from({ length: rows }, (_, i) => maxPercent.value - inc * i)
})

function getWeight(percent: number) {
  return Math.round((baseWeight.value * percent) / 100)
}
</script>

<template>
  <div class="tool-app">
    <section class="tool-panel concept-figure">
      <div class="tool-form tool-form--percentages">
        <label class="tool-field">
          <span>Charge (kg)</span>
          <input v-model.number="baseWeight" type="number" min="1" />
        </label>
        <label class="tool-field">
          <span>Incrément</span>
          <input v-model.number="increment" type="number" min="1" />
        </label>
        <label class="tool-field">
          <span>% max</span>
          <input v-model.number="maxPercent" type="number" min="1" max="200" />
        </label>
        <label class="tool-field">
          <span>% min</span>
          <input v-model.number="minPercent" type="number" min="1" />
        </label>
      </div>

      <div class="tool-table">
        <table>
          <thead>
            <tr>
              <th>%</th>
              <th>Charge</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pct in percents"
              :key="pct"
              :class="{ 'tool-table__row--emphasis': pct === 100 }"
            >
              <td>{{ pct }} %</td>
              <td>{{ getWeight(pct) }} kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
