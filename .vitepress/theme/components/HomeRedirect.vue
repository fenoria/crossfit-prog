<script setup lang="ts">
import { onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'

const { page, theme } = useData()
const router = useRouter()

onMounted(() => {
  if (page.value.relativePath !== 'index.md') return

  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  const isFullLoad =
    !nav || nav.type === 'navigate' || nav.type === 'reload'

  if (!isFullLoad) return

  const target = theme.value.currentWeek
  if (typeof target === 'string' && target.length > 0) {
    router.go(target)
  }
})
</script>

<template></template>
