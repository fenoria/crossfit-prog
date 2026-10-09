<script setup lang="ts">
import data from '../analytics/data.json'
import { useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const { tip, show, hide } = useTip()
const N = data.last + 1
const PL = 30, PR = 8, PT = 10, PB = 24, IW = 640 - PL - PR, IH = 190 - PT - PB
const DMAX = Math.max(4, ...data.deviations.map((d) => Math.max(d.up.length, d.down.length)))
const MID = PT + IH / 2
const dy = (v: number) => (v / DMAX) * (IH / 2)
const BW = IW / N
const ticks = Array.from({ length: DMAX + 1 }, (_, i) => i - DMAX / 2).filter((v) => Number.isInteger(v) && v % 2 === 0)

const lines = (d: (typeof data.deviations)[number]) => [
  ...d.up.map((t) => `▲ ${t}`),
  ...d.down.map((t) => `▼ ${t}`),
  ...d.other.map((t) => `• ${t}`),
]
</script>

<template>
  <div class="an an-panel">
    <div class="an-legend" style="margin-bottom: 8px">
      <span><i class="an-sw" style="background: var(--sw-cyan)" />Au-dessus du prescrit</span>
      <span><i class="an-sw" style="background: var(--sw-pink)" />En dessous (réduit, sauté)</span>
    </div>
    <svg viewBox="0 0 640 190" role="img" aria-label="Écarts prescrit contre réalisé par semaine">
      <g v-for="v in ticks" :key="v">
        <line :x1="PL" :x2="PL + IW" :y1="MID - dy(v)" :y2="MID - dy(v)" :stroke="v === 0 ? 'var(--sw-border)' : 'var(--sw-hover)'" />
        <text :x="PL - 6" :y="MID - dy(v) + 4" text-anchor="end">{{ Math.abs(v) }}</text>
      </g>
      <g
        v-for="d in data.deviations" :key="d.w"
        @mousemove="show($event, `S${wk(d.w)}`, lines(d).length ? lines(d) : ['Aucun écart noté'])"
        @mouseleave="hide"
      >
        <rect :x="PL + d.w * BW" :y="PT" :width="BW" :height="IH" fill="transparent" />
        <rect v-if="d.up.length" :x="PL + d.w * BW + BW / 2 - Math.min(17, BW * 0.25)" :y="MID - 1 - dy(d.up.length)" :width="Math.min(34, BW * 0.5)" :height="dy(d.up.length)" rx="4" fill="var(--sw-cyan)" />
        <rect v-if="d.down.length" :x="PL + d.w * BW + BW / 2 - Math.min(17, BW * 0.25)" :y="MID + 1" :width="Math.min(34, BW * 0.5)" :height="dy(d.down.length)" rx="4" fill="var(--sw-pink)" />
        <text :x="PL + d.w * BW + BW / 2" y="184" text-anchor="middle">S{{ wk(d.w) }}</text>
      </g>
    </svg>
    <AnTooltip :tip="tip" />
  </div>
</template>
