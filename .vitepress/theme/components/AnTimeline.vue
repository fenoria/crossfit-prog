<script setup lang="ts">
import { computed } from 'vue'
import { useSeasonData, weekNo } from '../analytics/useSeasonData'
import { useTip } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const data = useSeasonData()
const wk = (i: number) => weekNo(data, i)

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

const markers = [...data.markers].sort((a, b) => a.w - b.w)
const markerOf = (i: number) => markers.find((m) => m.w === i)
</script>

<template>
  <div class="an an-panel">
    <div class="an-scroll">
      <svg class="an-tl-svg" :viewBox="`0 0 ${width} 130`" :style="{ minWidth: '760px' }" role="img" aria-label="Frise de la saison">
        <text v-for="m in months" :key="m.x" :x="m.x" y="14" class="an-t-ink2">{{ m.label }}</text>
        <g
          v-for="(w, i) in data.weeks"
          :key="w.id"
          class="an-hit" @mousemove="show($event, `S${wk(w.n - 1)} · semaine du ${fmt(w.start)}`, [w.meso + (w.done ? ' · faite' : w.current ? ' · en cours' : '') + ` (prog ${w.id})`])" @pointerdown="show($event, `S${wk(w.n - 1)} · semaine du ${fmt(w.start)}`, [w.meso + (w.done ? ' · faite' : w.current ? ' · en cours' : '') + ` (prog ${w.id})`])"
          @mouseleave="hide"
        >
          <rect
            :x="x(i)" :y="TOP" :width="CW" :height="H" rx="6"
            :fill="`var(--sw-${colorOf(w.phase)})`"
            :fill-opacity="w.done || w.current ? 1 : 0.28"
            :stroke="w.current ? 'var(--sw-ink)' : 'none'" stroke-width="2"
          />
          <text :x="x(i) + CW / 2" :y="TOP + H + 15" text-anchor="middle" :class="{ 'an-t-bold': w.current }">
            {{ (w.n % 2 === 1 || w.current) ? wk(w.n - 1) : '' }}
          </text>
        </g>
        <g v-for="m in markers" :key="m.kind + m.w">
          <line :x1="x(m.w) + CW / 2" :x2="x(m.w) + CW / 2" :y1="TOP - 4" :y2="TOP + H + (m.kind === 'now' ? 40 : 22)" stroke="var(--sw-ink)" stroke-width="1.5" />
          <text
            :x="x(m.w) + CW / 2 + (m.side === 'left' ? -4 : 4)" :y="TOP + H + (m.kind === 'now' ? 52 : 34)"
            :text-anchor="m.side === 'left' ? 'end' : 'start'" class="an-t-bold"
          >{{ m.label }}</text>
        </g>
      </svg>
    </div>
    <div class="an-weeks" role="img" aria-label="Frise de la saison">
      <div
        v-for="w in data.weeks" :key="w.id" class="an-wk an-hit"
        :class="{ 'an-wk--done': w.done, 'an-wk--now': w.current, 'an-wk--mark': markerOf(w.n - 1) }"
        :style="{ '--wk': `var(--sw-${colorOf(w.phase)})` }"
        @mousemove="show($event, `S${wk(w.n - 1)} · semaine du ${fmt(w.start)}`, [w.meso + (w.done ? ' · faite' : w.current ? ' · en cours' : '') + ` (prog ${w.id})`, markerOf(w.n - 1)?.label ?? ''])" @pointerdown="show($event, `S${wk(w.n - 1)} · semaine du ${fmt(w.start)}`, [w.meso + (w.done ? ' · faite' : w.current ? ' · en cours' : '') + ` (prog ${w.id})`, markerOf(w.n - 1)?.label ?? ''])"
        @mouseleave="hide"
      >{{ wk(w.n - 1) }}</div>
    </div>
    <ul class="an-marks">
      <li v-for="m in markers" :key="m.kind + m.w"><b>S{{ wk(m.w) }}</b> {{ m.label }}</li>
    </ul>
    <div class="an-legend">
      <span v-for="p in data.phases" :key="p.id"><i class="an-sw" :style="{ background: `var(--sw-${p.color})` }" />{{ p.label }}</span>
    </div>
    <AnTooltip :tip="tip" @hide="hide" />
  </div>
</template>
