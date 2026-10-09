<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSeasonData } from '../analytics/useSeasonData'
import { useChartWidth } from '../analytics/useChartWidth'
import { useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const data = useSeasonData()

const { tip, show, hide } = useTip()
const N = data.last + 1
const box = ref<HTMLElement | null>(null)
const W = useChartWidth(box)
const PL = 30, PR = 6, PT = 8, PB = 22, IH = 130 - PT - PB
const IW = computed(() => W.value - PL - PR)
const BW = computed(() => IW.value / N)
// une étiquette de semaine tous les ~20 px ; « n.t. » seulement si la colonne est assez large
const tickEvery = computed(() => Math.max(1, Math.ceil(20 / BW.value)))

const cards = data.volumes.map((V) => {
  const known = V.values.filter((v): v is number => v != null)
  const planned = V.prescrit.filter((v): v is number => v != null)
  const max = Math.max(V.mrv ?? 0, ...known, ...planned) * 1.1 || 1
  const y = (v: number) => PT + IH - (v / max) * IH
  return {
    V, y, known: known.length,
    avg: known.length ? Math.round(known.reduce((a, b) => a + b, 0) / known.length) : 0,
  }
})
</script>

<template>
  <div class="an">
    <div ref="box" class="an-grid2">
      <div v-for="c in cards" :key="c.V.id" class="an-panel">
        <div class="an-card-head">
          <h3>{{ c.V.label }}</h3>
          <span class="an-eyebrow">{{ c.V.unit }}<template v-if="c.known"> · moy. {{ c.avg }}</template></span>
        </div>
        <svg :viewBox="`0 0 ${W} 130`" role="img" :aria-label="c.V.label">
          <rect v-if="c.V.mev != null && c.V.mrv != null" :x="PL" :y="c.y(c.V.mrv)" :width="IW" :height="c.y(c.V.mev) - c.y(c.V.mrv)" fill="var(--sw-green)" fill-opacity="0.12" />
          <line :x1="PL" :x2="PL + IW" :y1="c.y(0)" :y2="c.y(0)" stroke="var(--sw-border)" />
          <template v-if="c.V.mev != null">
            <line :x1="PL" :x2="PL + IW" :y1="c.y(c.V.mev)" :y2="c.y(c.V.mev)" stroke="var(--sw-green)" stroke-dasharray="4 3" stroke-width="1.5" />
            <text :x="PL - 5" :y="c.y(c.V.mev) + 4" text-anchor="end">{{ c.V.mev }}</text>
          </template>
          <text v-if="c.V.mrv != null" :x="PL - 5" :y="c.y(c.V.mrv) + 4" text-anchor="end">{{ c.V.mrv }}</text>
          <text :x="PL - 5" :y="c.y(0) + 4" text-anchor="end">0</text>
          <g
            v-for="(v, i) in c.V.values" :key="i"
            class="an-hit" @mousemove="show($event, `S${wk(i)} · ${v == null ? 'non tracé' : v + ' ' + c.V.unit}`, [c.V.prescrit[i] != null ? `Prescrit : ${c.V.prescrit[i]}` : '', c.V.notes[i]])" @pointerdown="show($event, `S${wk(i)} · ${v == null ? 'non tracé' : v + ' ' + c.V.unit}`, [c.V.prescrit[i] != null ? `Prescrit : ${c.V.prescrit[i]}` : '', c.V.notes[i]])"
            @mouseleave="hide"
          >
            <rect :x="PL + i * BW" :y="PT" :width="BW" :height="IH" fill="transparent" />
            <template v-if="v == null"><text v-if="BW >= 22" :x="PL + i * BW + BW / 2" :y="c.y(0) - 5" text-anchor="middle" class="an-t-sm">n.t.</text></template>
            <rect v-else-if="v === 0" :x="PL + i * BW + BW * 0.2" :y="c.y(0) - 2" :width="BW * 0.6" height="2" fill="var(--sw-cyan)" />
            <rect
              v-else
              :x="PL + i * BW + BW * 0.2" :y="c.y(v)" :width="BW * 0.6" :height="c.y(0) - c.y(v)" rx="3"
              :fill="c.V.mev != null && v < c.V.mev ? 'var(--sw-pink)' : 'var(--sw-cyan)'"
            />
            <line
              v-if="c.V.prescrit[i] != null"
              :x1="PL + i * BW + BW * 0.1" :x2="PL + i * BW + BW * 0.9" :y1="c.y(c.V.prescrit[i])" :y2="c.y(c.V.prescrit[i])"
              stroke="var(--sw-ink)" stroke-width="2.5" stroke-linecap="round"
            />
            <text v-if="i % tickEvery === 0" :x="PL + i * BW + BW / 2" y="124" text-anchor="middle" class="an-t-sm">{{ wk(i) }}</text>
          </g>
        </svg>
      </div>
    </div>
    <div class="an-legend">
      <span><i class="an-sw" style="background: var(--sw-cyan)" />Réalisé</span>
      <span><i class="an-sw" style="background: var(--sw-pink)" />Sous le MEV</span>
      <span><i class="an-sw an-sw--dash" />MEV</span>
      <span><i class="an-sw" style="background: var(--sw-green); opacity: 0.4" />MEV → MRV</span>
      <span><i class="an-sw an-sw--tick" />Prescrit</span>
      <span>n.t. = non tracé</span>
    </div>
    <AnTooltip :tip="tip" @hide="hide" />
  </div>
</template>
