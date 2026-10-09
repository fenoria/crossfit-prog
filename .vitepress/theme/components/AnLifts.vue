<script setup lang="ts">
import { computed } from 'vue'
import data from '../analytics/data.json'
import { fr, useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const { tip, show, hide } = useTip()
const N = data.last + 1
const PL = 34, PR = 10, PT = 10, PB = 22, IW = 300 - PL - PR, IH = 140 - PT - PB
const x = (i: number) => PL + (N > 1 ? (i / (N - 1)) * IW : IW / 2)
const rpeColor = (r: number | null) =>
  r == null ? 'var(--sw-muted)' : r <= 7 ? 'var(--sw-green)' : r < 9 ? 'var(--sw-yellow)' : 'var(--sw-red)'
const xTicks = Array.from({ length: N }, (_, i) => i).filter((i) => i % 3 === 0 || i === N - 1)

interface Pt { w: number; kg: number; rpe: number | null; type: string; serie: string; note: string }

const cards = computed(() =>
  data.lifts.map((L) => {
    // Un point par semaine : la charge la plus haute.
    const top = new Map<number, Pt>()
    for (const p of L.points as Pt[]) {
      const prev = top.get(p.w)
      if (!prev || p.kg > prev.kg) top.set(p.w, p)
    }
    const pts = [...top.values()].sort((a, b) => a.w - b.w)
    const vals = pts.map((p) => p.kg)
    const lo = Math.floor((Math.min(...vals) - 5) / 10) * 10
    const hi = Math.ceil((Math.max(...vals) + 5) / 10) * 10
    const step = hi - lo > 50 ? 20 : 10
    const y = (v: number) => PT + IH - ((v - lo) / (hi - lo)) * IH
    const yTicks: number[] = []
    for (let v = lo; v <= hi; v += step) yTicks.push(v)
    const segs = pts.slice(1).map((b, k) => ({ a: pts[k], b }))
    const last = pts[pts.length - 1]
    const firstTest = (L.points as Pt[]).find((p) => p.type === 'test')
    return { L, pts, y, yTicks, segs, last, firstTest }
  }),
)
</script>

<template>
  <div class="an">
    <div class="an-legend">
      <span><i class="an-sw" style="background: var(--sw-green)" />RPE ≤ 7</span>
      <span><i class="an-sw" style="background: var(--sw-yellow)" />RPE 8</span>
      <span><i class="an-sw" style="background: var(--sw-red)" />RPE 9+</span>
      <span><i class="an-sw" style="background: var(--sw-muted)" />RPE non noté</span>
      <span><i class="an-ring" />Test</span>
    </div>
    <div class="an-grid3">
      <div v-for="c in cards" :key="c.L.id" class="an-panel">
        <div class="an-card-head">
          <h3>{{ c.L.label }}</h3>
          <span class="an-big">{{ fr(c.last.kg) }}<small>kg · S{{ wk(c.last.w) }}</small></span>
        </div>
        <svg viewBox="0 0 300 140" role="img" :aria-label="c.L.label">
          <g v-for="v in c.yTicks" :key="v">
            <line :x1="PL" :x2="PL + IW" :y1="c.y(v)" :y2="c.y(v)" stroke="var(--sw-hover)" />
            <text :x="PL - 6" :y="c.y(v) + 4" text-anchor="end">{{ v }}</text>
          </g>
          <text v-for="i in xTicks" :key="i" :x="x(i)" y="134" text-anchor="middle">S{{ wk(i) }}</text>
          <line
            v-for="s in c.segs" :key="s.b.w"
            :x1="x(s.a.w)" :y1="c.y(s.a.kg)" :x2="x(s.b.w)" :y2="c.y(s.b.kg)"
            stroke="var(--sw-ink-2)" stroke-width="2" stroke-linecap="round"
            :stroke-dasharray="s.b.w - s.a.w > 1 ? '3 4' : 'none'"
          />
          <g
            v-for="p in c.pts" :key="p.w"
            @mousemove="show($event, `S${wk(p.w)} · ${fr(p.kg)} kg`, [[p.serie, p.type === 'test' ? 'test' : p.type === 'deload' ? 'deload' : ''].filter(Boolean).join(' · '), `RPE ${p.rpe == null ? 'non noté' : fr(p.rpe)}`, p.note])"
            @mouseleave="hide"
          >
            <circle :cx="x(p.w)" :cy="c.y(p.kg)" r="12" fill="transparent" />
            <circle v-if="p.type === 'test'" :cx="x(p.w)" :cy="c.y(p.kg)" r="5" fill="var(--sw-surface)" stroke="var(--sw-ink)" stroke-width="2.5" />
            <circle v-else :cx="x(p.w)" :cy="c.y(p.kg)" r="5.5" :fill="rpeColor(p.rpe)" stroke="var(--sw-surface)" stroke-width="1.5" />
          </g>
        </svg>
        <div class="an-card-foot">
          <template v-if="c.firstTest">Test S{{ wk(c.firstTest.w) }} : {{ fr(c.firstTest.kg) }} kg<template v-if="c.firstTest.serie"> ({{ c.firstTest.serie }})</template>.</template>
          <template v-if="c.L.pre"> Pré-blessure : {{ c.L.pre }} kg (1RM).</template>
        </div>
      </div>
    </div>
    <AnTooltip :tip="tip" />
  </div>
</template>
