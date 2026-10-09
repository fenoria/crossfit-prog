<script setup lang="ts">
import data from '../analytics/data.json'

const c = data.constats as { updated?: string; lede?: string; items?: { zone: string; niveau: string; titre: string; texte: string }[] }
const dot: Record<string, string> = { ok: 'green', warn: 'yellow', crit: 'red', info: 'purple' }
</script>

<template>
  <div class="an">
    <p v-if="c.lede" class="an-lede">{{ c.lede }}</p>
    <div class="an-takeaways">
      <div v-for="it in c.items ?? []" :key="it.zone" class="an-tk">
        <span class="an-tk__tag"><i class="an-dot" :style="{ background: `var(--sw-${dot[it.niveau] ?? 'purple'})` }" />{{ it.zone }}</span>
        <p><strong>{{ it.titre }}.</strong> {{ it.texte }}</p>
      </div>
    </div>
    <p v-if="c.updated" class="an-foot">Lecture rédigée au feedback, mise à jour le {{ c.updated }}. Les graphes, eux, sont calculés depuis le journal.</p>
  </div>
</template>
