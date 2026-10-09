<script setup lang="ts">
import data from '../analytics/data.json'

const k = data.kpis
</script>

<template>
  <div class="an an-kpis">
    <div class="an-kpi an-c1">
      <div class="an-kpi__v">{{ k.weeks_done }}<small>/{{ k.weeks_total }}</small></div>
      <div class="an-kpi__l">semaines faites ({{ data.current.id }} en cours)</div>
    </div>
    <div class="an-kpi an-c2">
      <div class="an-kpi__v">{{ k.days_to_open }}<small> j</small></div>
      <div class="an-kpi__l">avant l'Open {{ k.open_label }}</div>
    </div>
    <div class="an-kpi an-c3">
      <div class="an-kpi__v an-kpi__v--sm">{{ k.competition.split(' — ')[0] }}</div>
      <div class="an-kpi__l">{{ k.competition.split(' — ')[1] }}</div>
    </div>
    <div class="an-kpi an-c4">
      <div class="an-kpi__v">{{ k.z2_ok }}<small>/{{ k.z2_of }}</small></div>
      <div class="an-kpi__l">semaines au plancher Z2 de {{ k.z2_mev }} min</div>
    </div>
  </div>
</template>
