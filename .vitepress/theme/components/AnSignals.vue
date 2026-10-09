<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSeasonData } from '../analytics/useSeasonData'
import { useChartWidth } from '../analytics/useChartWidth'
import { useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const data = useSeasonData()

const { tip, show, hide } = useTip()
const box = ref<HTMLElement | null>(null)
const W = useChartWidth(box)
const N = data.last + 1
const LEVELS = [
  { label: 'RAS', fill: 'var(--sw-hover)' },
  { label: 'Tension, gêne légère', fill: 'var(--sw-yellow)' },
  { label: 'Gêne, geste réduit ou sauté', fill: 'var(--sw-orange)' },
  { label: 'Douleur ≥ 4/10', fill: 'var(--sw-red)' },
]
// Colonnes réparties sur toute la largeur, comme les autres graphes ; lignes basses (16 px)
const SL = 74, SR = 22, CH = 16, GAP = 2
const colW = computed(() => (W.value - SL) / N)
const cellW = computed(() => Math.max(3, colW.value - GAP))
const x = (i: number) => SL + i * colW.value
const H = data.signals.length * SR + 18
const tickEvery = computed(() => Math.max(1, Math.ceil(20 / colW.value)))
const cellTip = (row: (typeof data.signals)[number], i: number) => [
  `${row.label} · S${wk(i)}`,
  [row.levels[i] == null ? 'Non noté' : LEVELS[row.levels[i] as number].label, row.notes[i]],
] as const
</script>

<template>
  <div ref="box" class="an an-panel">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Signaux épaule, adducteur et mains par semaine">
      <template v-for="(row, ri) in data.signals" :key="row.id">
        <text x="0" :y="ri * SR + 12" class="an-t-label">{{ row.label }}</text>
        <g
          v-for="(lv, i) in row.levels" :key="i"
          class="an-hit"
          @mousemove="show($event, cellTip(row, i)[0], [...cellTip(row, i)[1]])"
          @pointerdown="show($event, cellTip(row, i)[0], [...cellTip(row, i)[1]])"
          @mouseleave="hide"
        >
          <rect
            :x="x(i)" :y="ri * SR" :width="cellW" :height="CH" rx="3"
            :fill="lv == null ? 'transparent' : LEVELS[lv].fill"
            :stroke="lv == null ? 'var(--sw-border)' : 'none'" stroke-dasharray="3 3"
          />
          <text v-if="lv === 3 && cellW >= 10" :x="x(i) + cellW / 2" :y="ri * SR + 12" text-anchor="middle" class="an-t-mark">!</text>
        </g>
      </template>
      <template v-for="i in N" :key="i">
        <text v-if="(i - 1) % tickEvery === 0" :x="x(i - 1) + cellW / 2" :y="data.signals.length * SR + 12" text-anchor="middle" class="an-t-sm">{{ wk(i - 1) }}</text>
      </template>
    </svg>
    <div class="an-legend" style="margin-top: 10px">
      <span v-for="l in LEVELS" :key="l.label"><i class="an-sw" :style="{ background: l.fill }" />{{ l.label }}</span>
      <span><i class="an-sw an-sw--empty" />Non noté</span>
    </div>
    <AnTooltip :tip="tip" @hide="hide" />
  </div>
</template>
