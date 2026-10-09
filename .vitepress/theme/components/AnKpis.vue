<script setup lang="ts">
import { useSeasonData } from '../analytics/useSeasonData'

const data = useSeasonData()

const k = data.kpis
</script>

<template>
  <div class="an an-kpis">
    <div class="an-kpi an-c1">
      <div class="an-kpi__v">{{ k.macro ? k.macro.pct : '–' }}<small> %</small></div>
      <div class="an-kpi__l">
        {{ k.macro ? k.macro.label.split(' · ')[0] : 'Macro' }}<template v-if="k.macro && k.macro.week"> · Semaine {{ k.macro.week }}/{{ k.macro.weeks }}</template>
      </div>
    </div>
    <div class="an-kpi an-c2">
      <div class="an-kpi__v">{{ k.days_to_open }}<small> j</small></div>
      <div class="an-kpi__l">avant l'Open {{ k.open_label.split(' ')[0] }}</div>
    </div>
    <div class="an-kpi an-c3">
      <div class="an-kpi__v">{{ (k.tonnage_week / 1000).toFixed(1).replace('.', ',') }}<small> t</small></div>
      <div class="an-kpi__l">
        Tonnage {{ k.week_id }}<template v-if="k.tonnage_prev"> · {{ k.prev_id }} : {{ (k.tonnage_prev / 1000).toFixed(1).replace('.', ',') }} t</template>
      </div>
    </div>
    <div class="an-kpi an-c4">
      <div class="an-kpi__v">{{ k.z2_week ?? '–' }}<small> /{{ k.z2_mev }}</small></div>
      <div class="an-kpi__l">Min. de Z2 {{ k.week_id }}</div>
    </div>
  </div>
</template>
