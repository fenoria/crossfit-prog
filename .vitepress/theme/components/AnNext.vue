<script setup lang="ts">
import data from '../analytics/data.json'

const cur = data.current
</script>

<template>
  <div class="an an-panel an-next">
    <div v-if="cur.id" class="an-next__row an-next__row--now">
      <div class="an-next__when"><span>{{ cur.id }} · en cours</span></div>
      <div>
        <strong>{{ cur.meso }}<template v-if="cur.phase_micro"> · {{ cur.phase_micro }}</template>.</strong>
        {{ cur.suite || cur.synthese }}
      </div>
    </div>
    <div v-for="n in data.next" :key="n.sort + n.text" class="an-next__row">
      <div class="an-next__when">{{ n.week ? n.week + ' · ' : '' }}{{ n.when }}</div>
      <div>{{ n.text }}</div>
    </div>
  </div>
</template>
