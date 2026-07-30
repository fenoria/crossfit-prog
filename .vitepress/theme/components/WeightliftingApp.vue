<script setup lang="ts">
import WeightliftingTable from './WeightliftingTable.vue'
import { snatchMoves, cleanMoves, jerkMoves } from '../weightlifting/moves'
</script>

<template>
  <div class="tool-app">
    <section class="tool-panel concept-figure tool-section">
      <h2 class="tool-section__heading">Arraché</h2>
      <WeightliftingTable
        :moves="snatchMoves"
        :default-max="65"
        storage-prefix="lift:snatch"
      />
    </section>

    <section class="tool-panel concept-figure tool-section">
      <h2 class="tool-section__heading">Épaulé</h2>
      <WeightliftingTable
        :moves="cleanMoves"
        :default-max="105"
        storage-prefix="lift:clean"
      />
    </section>

    <section class="tool-panel concept-figure tool-section">
      <h2 class="tool-section__heading">Jeté</h2>
      <WeightliftingTable
        :moves="jerkMoves"
        :default-max="80"
        storage-prefix="lift:jerk"
      />
    </section>
  </div>
</template>
