<script setup lang="ts">
import { useSeasonData } from '../analytics/useSeasonData'
import { wk } from '../analytics/useTip'

const data = useSeasonData()
</script>

<template>
  <div class="an an-panel an-ladder">
    <div v-for="r in data.ladder" :key="r.id" class="an-rung">
      <span class="an-rung__name">{{ r.label }}</span>
      <div class="an-pips">
        <span
          v-for="k in 5" :key="k"
          class="an-pip"
          :class="{ 'an-pip--on': k <= r.now, 'an-pip--base': k <= r.base && r.now > r.base, 'an-pip--off': r.etat === 'suspendu' && k <= r.now }"
        />
      </div>
      <span class="an-pill"><i class="an-dot" :style="{ background: r.etat === 'actif' ? 'var(--sw-green)' : 'var(--sw-red)' }" />cran {{ r.now }} · {{ r.etat }}</span>
      <div class="an-rung__detail">
        <template v-if="r.base !== r.now">Cran {{ r.base }} → {{ r.now }}. </template>{{ r.note }} <span class="an-rung__w">(S{{ wk(r.w) }})</span>
      </div>
    </div>
    <div class="an-legend" style="margin-top: 4px">
      <span><i class="an-sw" style="background: var(--sw-cyan)" />Cran atteint</span>
      <span><i class="an-sw" style="background: var(--sw-cyan); opacity: 0.45" />Cran de départ (baseline)</span>
      <span><i class="an-sw" style="background: var(--sw-purple)" />Geste suspendu</span>
    </div>
  </div>
</template>
