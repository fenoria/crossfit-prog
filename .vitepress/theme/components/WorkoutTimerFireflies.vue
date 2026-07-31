<script setup lang="ts">
import { buildFireflies } from '../timer/fireflies'

const fireflies = buildFireflies()
</script>

<template>
  <div class="workout-timer__fireflies" aria-hidden="true">
    <span
      v-for="(fly, i) in fireflies"
      :key="i"
      class="workout-timer__firefly-wrap"
      :style="{
        top: fly.top,
        left: fly.left,
        '--ff-sway-duration': `${fly.swayDuration}s`,
        '--ff-sway-delay': `${fly.swayDelay}s`,
      }"
    >
      <span
        class="workout-timer__firefly"
        :class="[
          `workout-timer__firefly--drift-${fly.drift}`,
          { 'workout-timer__firefly--large': fly.size > 3 },
        ]"
        :style="{
          '--ff-rgb': fly.rgb,
          '--ff-size': `${fly.size}px`,
          '--ff-drift-duration': `${fly.driftDuration}s`,
          '--ff-drift-delay': `${fly.driftDelay}s`,
          '--ff-twinkle': `${fly.twinkle}s`,
          '--ff-twinkle-delay': `${fly.twinkleDelay}s`,
        }"
      />
    </span>
  </div>
</template>
