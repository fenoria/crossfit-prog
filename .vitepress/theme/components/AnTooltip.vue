<script setup lang="ts">
import { computed } from 'vue'
import type { TipState } from '../analytics/useTip'

const props = defineProps<{ tip: TipState }>()

// Décalage curseur ; bascule à gauche près du bord droit.
const style = computed(() => {
  const w = typeof window === 'undefined' ? 1200 : window.innerWidth
  const left = props.tip.x + 14 + 280 > w ? props.tip.x - 294 : props.tip.x + 14
  return { left: `${Math.max(8, left)}px`, top: `${props.tip.y + 14}px` }
})
</script>

<template>
  <div v-if="tip.visible" class="an-tip" :style="style" role="tooltip">
    <strong>{{ tip.title }}</strong>
    <div v-for="(l, i) in tip.lines" :key="i">{{ l }}</div>
  </div>
</template>
