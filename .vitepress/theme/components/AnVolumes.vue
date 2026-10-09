<script setup lang="ts">
import data from '../analytics/data.json'
import { useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const { tip, show, hide } = useTip()
const N = data.last + 1
const PL = 30, PR = 6, PT = 8, PB = 22, IW = 300 - PL - PR, IH = 130 - PT - PB
const BW = IW / N

const cards = data.volumes.map((V) => {
  const known = V.values.filter((v): v is number => v != null)
  const max = Math.max(V.mrv ?? 0, ...known) * 1.1 || 1
  const y = (v: number) => PT + IH - (v / max) * IH
  return {
    V, y,
    avg: known.length ? Math.round(known.reduce((a, b) => a + b, 0) / known.length) : 0,
  }
})
</script>

<template>
  <div class="an">
    <div class="an-grid2">
      <div v-for="c in cards" :key="c.V.id" class="an-panel">
        <div class="an-card-head">
          <h3>{{ c.V.label }}</h3>
          <span class="an-eyebrow">{{ c.V.unit }} · moy. {{ c.avg }}</span>
        </div>
        <svg viewBox="0 0 300 130" role="img" :aria-label="c.V.label">
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
            @mousemove="show($event, `S${wk(i)} · ${v == null ? 'non tracé' : v + ' ' + c.V.unit}`, [c.V.notes[i]])"
            @mouseleave="hide"
          >
            <rect :x="PL + i * BW" :y="PT" :width="BW" :height="IH" fill="transparent" />
            <text v-if="v == null" :x="PL + i * BW + BW / 2" :y="c.y(0) - 5" text-anchor="middle" class="an-t-sm">n.t.</text>
            <rect v-else-if="v === 0" :x="PL + i * BW + BW * 0.2" :y="c.y(0) - 2" :width="BW * 0.6" height="2" fill="var(--sw-cyan)" />
            <rect
              v-else
              :x="PL + i * BW + BW * 0.2" :y="c.y(v)" :width="BW * 0.6" :height="c.y(0) - c.y(v)" rx="3"
              :fill="c.V.mev != null && v < c.V.mev ? 'var(--sw-pink)' : 'var(--sw-cyan)'"
            />
            <text :x="PL + i * BW + BW / 2" y="124" text-anchor="middle" class="an-t-sm">{{ wk(i) }}</text>
          </g>
        </svg>
      </div>
    </div>
    <div class="an-legend">
      <span><i class="an-sw" style="background: var(--sw-cyan)" />Au-dessus du MEV</span>
      <span><i class="an-sw" style="background: var(--sw-pink)" />Sous le MEV</span>
      <span><i class="an-sw" style="background: var(--sw-green); opacity: 0.4" />Zone MEV → MRV</span>
      <span>« n.t. » = non tracé</span>
    </div>
    <AnTooltip :tip="tip" />
  </div>
</template>
