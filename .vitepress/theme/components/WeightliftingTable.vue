<script setup lang="ts">
import { ref } from 'vue'
import { useToolStorage } from '../composables/useToolStorage'
import type { WeightliftingMove } from '../weightlifting/types'
import { getLiftWeight } from '../weightlifting/weight'

const props = defineProps<{
  moves: WeightliftingMove[]
  defaultMax: number
  storagePrefix: string
}>()

const max = ref(props.defaultMax)
const rounds = ref(5)
const reps = ref(4)

useToolStorage(max, `${props.storagePrefix}:max`)
useToolStorage(rounds, `${props.storagePrefix}:rounds`)
useToolStorage(reps, `${props.storagePrefix}:reps`)
</script>

<template>
  <div class="tool-form tool-form--lifts">
    <label class="tool-field">
      <span>Max (kg)</span>
      <input v-model.number="max" type="number" min="1" />
    </label>
    <label class="tool-field">
      <span>Séries</span>
      <input v-model.number="rounds" type="number" min="1" />
    </label>
    <label class="tool-field">
      <span>Reps</span>
      <input v-model.number="reps" type="number" min="1" />
    </label>
  </div>

  <div class="tool-table tool-table--lifts">
    <table>
      <thead>
        <tr>
          <th>Exercice</th>
          <th class="tool-table__col--wide">Abrév.</th>
          <th class="tool-table__col--wide">Traduction</th>
          <th>Charge</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="move in moves" :key="move.abbreviation">
          <td>{{ move.label }}</td>
          <td class="tool-table__col--wide">{{ move.abbreviation }}</td>
          <td class="tool-table__col--wide">{{ move.labelEn }}</td>
          <td>{{ getLiftWeight(max, rounds, reps, move) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
