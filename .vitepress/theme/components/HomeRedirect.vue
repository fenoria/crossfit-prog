<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vitepress'

const { page, site, theme } = useData()

/** Chemin absolu sur l’hôte (inclut `base` GitHub Pages). */
function currentWeekPath(): string {
  const week = theme.value.currentWeek
  if (typeof week !== 'string' || week.length === 0) return ''

  const base = site.value.base
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base

  let path = week
  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || '/'
  }
  if (!path.startsWith('/')) path = `/${path}`

  return `${basePath}${path}`
}

onMounted(() => {
  if (page.value.relativePath !== 'index.md') return

  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  const isFullLoad =
    !nav || nav.type === 'navigate' || nav.type === 'reload'

  if (!isFullLoad) return

  const target = currentWeekPath()
  if (target && target !== window.location.pathname) {
    window.location.replace(target)
  }
})
</script>

<template></template>
