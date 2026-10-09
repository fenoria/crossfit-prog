<script setup lang="ts">
import data from '../analytics/data.json'
import { useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const { tip, show, hide } = useTip()
const N = data.last + 1
const LEVELS = [
  { label: 'RAS', fill: 'var(--sw-hover)' },
  { label: 'Tension, gêne légère', fill: 'var(--sw-yellow)' },
  { label: 'Gêne, geste réduit ou sauté', fill: 'var(--sw-orange)' },
  { label: 'Douleur ≥ 4/10', fill: 'var(--sw-red)' },
]
const SL = 78, SC = 30, SG = 3, SR = 30
const W = SL + N * (SC + SG)
const H = data.signals.length * SR + 22
</script>

<template>
  <div class="an an-panel">
    <div class="an-scroll">
      <svg :viewBox="`0 0 ${W} ${H}`" :style="{ minWidth: '380px' }" role="img" aria-label="Signaux épaule, adducteur et mains par semaine">
        <template v-for="(row, ri) in data.signals" :key="row.id">
          <text x="0" :y="ri * SR + 19" class="an-t-label">{{ row.label }}</text>
          <g
            v-for="(lv, i) in row.levels" :key="i"
            @mousemove="show($event, `${row.label} · S${wk(i)}`, [lv == null ? 'Non noté' : LEVELS[lv].label, row.notes[i]])"
            @mouseleave="hide"
          >
            <rect
              :x="SL + i * (SC + SG)" :y="ri * SR" :width="SC" :height="SR - 4" rx="6"
              :fill="lv == null ? 'transparent' : LEVELS[lv].fill"
              :stroke="lv == null ? 'var(--sw-border)' : 'none'" stroke-dasharray="3 3"
            />
            <text v-if="lv === 3" :x="SL + i * (SC + SG) + SC / 2" :y="ri * SR + 17" text-anchor="middle" class="an-t-mark">!</text>
          </g>
        </template>
        <text v-for="i in N" :key="i" :x="SL + (i - 1) * (SC + SG) + SC / 2" :y="data.signals.length * SR + 14" text-anchor="middle" class="an-t-sm">{{ wk(i - 1) }}</text>
      </svg>
    </div>
    <div class="an-legend" style="margin-top: 10px">
      <span v-for="l in LEVELS" :key="l.label"><i class="an-sw" :style="{ background: l.fill }" />{{ l.label }}</span>
    </div>
    <AnTooltip :tip="tip" />
  </div>
</template>
