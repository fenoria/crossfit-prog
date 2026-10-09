<script setup lang="ts">
import { computed } from 'vue'
import data from '../analytics/data.json'
import { fr, useTip, wk } from '../analytics/useTip'
import AnTooltip from './AnTooltip.vue'

const { tip, show, hide } = useTip()
const N = data.last + 1
const PL = 34, PR = 8, IW = 300 - PL - PR
// Zones verticales : bandeau des blocs · e1RM · tonnage · axe semaines
const BAND_Y = 2, BAND_H = 11
const PT = 22, IH = 92
const TON_Y = 136, TON_H = 30
const AXIS_Y = 182

const colW = IW / N
const cx = (i: number) => PL + (i + 0.5) * colW
const bandX = (i: number) => PL + i * colW
const phaseColor = (id: string) => data.phases.find((p) => p.id === id)?.color ?? 's5'
const rpeColor = (r: number | null) =>
  r == null ? 'var(--sw-muted)' : r <= 7 ? 'var(--sw-green)' : r < 9 ? 'var(--sw-yellow)' : 'var(--sw-red)'
const xTicks = Array.from({ length: N }, (_, i) => i).filter((i) => i % 3 === 0 || i === N - 1)
const blockOf = (w: number) => data.blocks.find((b) => w >= b.from && w <= b.to)

interface Pt {
  w: number; kg: number; rpe: number | null; type: string; serie: string
  sets: number | null; reps: number | null; e1rm: number | null; tonnage: number | null
  note: string; pause?: boolean
}

const cards = computed(() =>
  data.lifts.map((L) => {
    const weeks = L.weeks as Pt[]
    const plotted = weeks.filter((p) => p.e1rm != null)
    const vals = plotted.map((p) => p.e1rm as number)
    const lo = Math.floor((Math.min(...vals) - 4) / 10) * 10
    const hi = Math.ceil((Math.max(...vals) + 4) / 10) * 10
    const step = hi - lo > 50 ? 20 : 10
    const y = (v: number) => PT + IH - ((v - lo) / (hi - lo)) * IH
    const yTicks: number[] = []
    for (let v = lo; v <= hi; v += step) yTicks.push(v)
    const tons = weeks.map((p) => p.tonnage ?? 0)
    const tonMax = Math.max(...tons, 1)
    const totReps = weeks.map((p) => (p.sets && p.reps ? p.sets * p.reps : 0))
    const repMax = Math.max(...totReps, 1)
    const radius = (p: Pt) => (p.sets && p.reps ? 3.5 + 3.5 * ((p.sets * p.reps) / repMax) : 4)
    const segs = plotted.slice(1).map((b, k) => ({ a: plotted[k], b }))
    const last = plotted[plotted.length - 1]
    return { L, weeks, plotted, y, yTicks, segs, last, tonMax, radius, hi, lo }
  }),
)

const tipFor = (p: Pt) => {
  const blk = blockOf(p.w)
  return [
    `${fr(p.kg)} kg · ${p.serie || 'séries non notées'} · RPE ${p.rpe == null ? 'non noté' : fr(p.rpe)}`,
    p.tonnage != null ? `Tonnage ${p.tonnage} kg` : '',
    p.type === 'test' ? 'Test' : p.type === 'deload' ? 'Deload' : '',
    p.pause ? 'Avec pause 2 s : e1RM corrigé +7 % (équivalent sans pause)' : '',
    blk ? `Bloc : ${blk.meso}` : '',
    p.note,
  ]
}
</script>

<template>
  <div class="an">
    <div class="an-legend">
      <span><i class="an-sw" style="background: var(--sw-green)" />RPE ≤ 7</span>
      <span><i class="an-sw" style="background: var(--sw-yellow)" />RPE 8</span>
      <span><i class="an-sw" style="background: var(--sw-red)" />RPE 9+</span>
      <span><i class="an-ring" />Test</span>
      <span>Taille du point = séries × reps</span>
      <span><i class="an-diamond" />Avec pause (e1RM +7 %)</span>
      <span><i class="an-sw an-sw--hatch" />Deload</span>
    </div>
    <div class="an-grid-lifts">
      <div v-for="c in cards" :key="c.L.id" class="an-panel">
        <div class="an-card-head">
          <h3>{{ c.L.label }}</h3>
          <span v-if="c.last" class="an-big">{{ Math.round(c.last.e1rm as number) }}<small>kg e1RM · S{{ wk(c.last.w) }}</small></span>
        </div>
        <div v-if="c.last" class="an-card-sub">
          dernière série clé : {{ fr(c.last.kg) }} kg · {{ c.last.serie || '?' }} · RPE {{ c.last.rpe == null ? '?' : fr(c.last.rpe) }}
        </div>
        <svg viewBox="0 0 300 190" role="img" :aria-label="`${c.L.label} : e1RM et tonnage par semaine`">
          <defs>
            <pattern :id="`hatch-${c.L.id}`" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" stroke="var(--sw-border)" stroke-width="1.5" />
            </pattern>
          </defs>

          <!-- bandes de bloc -->
          <g v-for="b in data.blocks" :key="b.from">
            <rect :x="bandX(b.from)" :y="BAND_Y" :width="(b.to - b.from + 1) * colW - 1" :height="BAND_H" rx="2" :fill="`var(--sw-${phaseColor(b.phase)})`" fill-opacity="0.35" />
            <rect :x="bandX(b.from)" :y="PT" :width="(b.to - b.from + 1) * colW" :height="TON_Y + TON_H - PT" :fill="`var(--sw-${phaseColor(b.phase)})`" fill-opacity="0.05" />
            <text v-if="b.short.length * 4.5 + 2 <= (b.to - b.from + 1) * colW - 1" :x="bandX(b.from) + 2" :y="BAND_Y + 8" class="an-t-band">{{ b.short }}</text>
          </g>
          <rect v-for="d in data.deloads" :key="`d${d}`" :x="bandX(d)" :y="PT" :width="colW" :height="TON_Y + TON_H - PT" :fill="`url(#hatch-${c.L.id})`" fill-opacity="0.5" />

          <!-- e1RM -->
          <g v-for="v in c.yTicks" :key="v">
            <line :x1="PL" :x2="PL + IW" :y1="c.y(v)" :y2="c.y(v)" stroke="var(--sw-hover)" />
            <text :x="PL - 6" :y="c.y(v) + 4" text-anchor="end">{{ v }}</text>
          </g>
          <line
            v-for="s in c.segs" :key="s.b.w"
            :x1="cx(s.a.w)" :y1="c.y(s.a.e1rm as number)" :x2="cx(s.b.w)" :y2="c.y(s.b.e1rm as number)"
            stroke="var(--sw-ink-2)" stroke-width="2" stroke-linecap="round"
            :stroke-dasharray="s.b.w - s.a.w > 1 ? '3 4' : 'none'"
          />
          <g v-for="p in c.plotted" :key="`p${p.w}`" @mousemove="show($event, `S${wk(p.w)} · e1RM ≈ ${fr(Math.round(p.e1rm as number))} kg`, tipFor(p))" @mouseleave="hide">
            <circle :cx="cx(p.w)" :cy="c.y(p.e1rm as number)" r="12" fill="transparent" />
            <circle
              v-if="p.type === 'test'"
              :cx="cx(p.w)" :cy="c.y(p.e1rm as number)" :r="c.radius(p)"
              fill="var(--sw-surface)" stroke="var(--sw-ink)" stroke-width="2.5"
            />
            <rect
              v-else-if="p.pause"
              :x="cx(p.w) - c.radius(p)" :y="c.y(p.e1rm as number) - c.radius(p)" :width="c.radius(p) * 2" :height="c.radius(p) * 2"
              :transform="`rotate(45 ${cx(p.w)} ${c.y(p.e1rm as number)})`"
              :fill="rpeColor(p.rpe)" stroke="var(--sw-surface)" stroke-width="1.5"
            />
            <circle
              v-else
              :cx="cx(p.w)" :cy="c.y(p.e1rm as number)" :r="c.radius(p)"
              :fill="rpeColor(p.rpe)" stroke="var(--sw-surface)" stroke-width="1.5"
            />
          </g>

          <!-- tonnage -->
          <line :x1="PL" :x2="PL + IW" :y1="TON_Y + TON_H" :y2="TON_Y + TON_H" stroke="var(--sw-border)" />
          <text :x="PL - 6" :y="TON_Y + 8" text-anchor="end" class="an-t-sm">{{ c.tonMax >= 1000 ? (c.tonMax / 1000).toFixed(1).replace('.', ',') + 't' : c.tonMax }}</text>
          <text :x="PL - 6" :y="TON_Y + TON_H + 3" text-anchor="end" class="an-t-sm">0</text>
          <g v-for="p in c.weeks" :key="`t${p.w}`" @mousemove="show($event, `S${wk(p.w)} · tonnage`, [p.tonnage != null ? `${p.tonnage} kg (séries × reps × kg, série clé)` : 'séries non notées'])" @mouseleave="hide">
            <rect :x="bandX(p.w)" :y="TON_Y" :width="colW" :height="TON_H" fill="transparent" />
            <rect
              v-if="p.tonnage"
              :x="cx(p.w) - colW * 0.3" :y="TON_Y + TON_H - (p.tonnage / c.tonMax) * TON_H"
              :width="colW * 0.6" :height="(p.tonnage / c.tonMax) * TON_H" rx="2"
              fill="var(--sw-purple)" fill-opacity="0.9"
            />
          </g>
          <text :x="PL" :y="TON_Y - 4" class="an-t-sm">tonnage</text>

          <text v-for="i in xTicks" :key="i" :x="cx(i)" :y="AXIS_Y" text-anchor="middle">S{{ wk(i) }}</text>
        </svg>
        <div class="an-card-foot">
          <template v-if="c.L.first_test">Test S{{ wk(c.L.first_test.w) }} : {{ fr(c.L.first_test.kg) }} kg<template v-if="c.L.first_test.serie"> ({{ c.L.first_test.serie }})</template>.</template>
          <template v-if="c.L.pre"> Pré-blessure : {{ c.L.pre }} kg (1RM).</template>
          <template v-if="c.L.bodyweight"> e1RM exprimé en lest (poids de corps {{ c.L.bodyweight }} kg).</template>
        </div>
      </div>
    </div>
    <AnTooltip :tip="tip" />
  </div>
</template>
