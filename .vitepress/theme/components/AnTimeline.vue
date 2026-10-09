<script setup lang="ts">
import { computed } from 'vue'
import data from '../analytics/data.json'
import { useTip } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const { tip, show, hide } = useTip()
const CW = 30, GAP = 3, LEFT = 4, TOP = 30, H = 46
const width = LEFT + data.weeks.length * (CW + GAP) + 4
const colorOf = (id: string) => data.phases.find((p) => p.id === id)?.color ?? 's5'
const x = (i: number) => LEFT + i * (CW + GAP)

const fmt = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

const months = computed(() => {
  let last = -1
  return data.weeks.flatMap((w, i) => {
    const m = new Date(w.start + 'T12:00:00').getMonth()
    if (m === last) return []
    last = m
    return [{ x: x(i), label: new Date(w.start + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') }]
  })
})

const cur = data.weeks.findIndex((w) => w.current)
const openIdx = data.weeks.findIndex((w) => w.meso === 'Open')
const fireIdx = data.weeks.findIndex((w) => w.meso === 'Expression Fire')
</script>

<template>
  <div class="an an-panel">
    <div class="an-scroll">
      <svg :viewBox="`0 0 ${width} 130`" :style="{ minWidth: '760px' }" role="img" aria-label="Frise de la saison">
        <text v-for="m in months" :key="m.x" :x="m.x" y="14" class="an-t-ink2">{{ m.label }}</text>
        <g
          v-for="(w, i) in data.weeks"
          :key="w.id"
          @mousemove="show($event, `${w.id} · semaine du ${fmt(w.start)}`, [w.meso + (w.done ? ' · faite' : w.current ? ' · en cours' : '')])"
          @mouseleave="hide"
        >
          <rect
            :x="x(i)" :y="TOP" :width="CW" :height="H" rx="6"
            :fill="`var(--sw-${colorOf(w.phase)})`"
            :fill-opacity="w.done || w.current ? 1 : 0.28"
            :stroke="w.current ? 'var(--sw-ink)' : 'none'" stroke-width="2"
          />
          <text :x="x(i) + CW / 2" :y="TOP + H + 15" text-anchor="middle" :class="{ 'an-t-bold': w.current }">
            {{ (w.n % 2 === 1 || w.current) ? String(w.n).padStart(2, '0') : '' }}
          </text>
        </g>
        <template v-if="fireIdx >= 0">
          <line :x1="x(fireIdx) + CW / 2" :x2="x(fireIdx) + CW / 2" :y1="TOP - 4" :y2="TOP + H + 22" stroke="var(--sw-ink)" stroke-width="1.5" />
          <text :x="x(fireIdx) + CW / 2 + 4" :y="TOP + H + 34" class="an-t-bold">Fire · 7e/20</text>
        </template>
        <template v-if="cur >= 0">
          <line :x1="x(cur) + CW / 2" :x2="x(cur) + CW / 2" :y1="TOP - 4" :y2="TOP + H + 40" stroke="var(--sw-ink)" stroke-width="1.5" />
          <text :x="x(cur) + CW / 2 + 4" :y="TOP + H + 52" class="an-t-bold">Aujourd'hui · {{ data.weeks[cur].id }}</text>
        </template>
        <template v-if="openIdx >= 0">
          <line :x1="x(openIdx) + CW / 2" :x2="x(openIdx) + CW / 2" :y1="TOP - 4" :y2="TOP + H + 22" stroke="var(--sw-ink)" stroke-width="1.5" />
          <text :x="x(openIdx) + CW / 2 - 4" :y="TOP + H + 34" text-anchor="end" class="an-t-bold">Open {{ data.kpis.open_label.split(' ')[0] }}</text>
        </template>
      </svg>
    </div>
    <div class="an-legend">
      <span v-for="p in data.phases" :key="p.id"><i class="an-sw" :style="{ background: `var(--sw-${p.color})` }" />{{ p.label }}</span>
    </div>
    <AnTooltip :tip="tip" />
  </div>
</template>
