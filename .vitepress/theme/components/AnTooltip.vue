<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import type { TipState } from '../analytics/useTip'

const props = defineProps<{ tip: TipState }>()
const emit = defineEmits<{ hide: [] }>()

// Tactile : pas de survol, donc l'info-bulle se ferme au prochain appui hors d'une zone interactive.
function onPointerDown(e: PointerEvent) {
  if (!(e.target as Element | null)?.closest?.('.an-hit')) emit('hide')
}
onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))

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
