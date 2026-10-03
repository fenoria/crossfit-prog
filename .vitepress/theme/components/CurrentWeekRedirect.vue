<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'

interface WeekEntry {
  link: string
  start: string
}

const { theme } = useData()
const router = useRouter()
const target = ref<WeekEntry | null>(null)

/** Date locale du navigateur au format ISO (pas UTC : lundi 00h30 reste lundi). */
function localIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

onMounted(() => {
  const weeks: WeekEntry[] = theme.value.weeks ?? []
  const today = localIsoDate(new Date())
  // Dernière semaine commencée ; avant la première semaine → la première
  target.value = weeks.filter((w) => w.start <= today).at(-1) ?? weeks[0] ?? null
  if (!target.value) return
  // replaceState d'abord : « retour » ne renvoie pas sur /en-cours (boucle)
  const href = withBase(target.value.link)
  history.replaceState(history.state, '', href)
  router.go(href)
})
</script>

<template>
  <p v-if="target">
    Redirection vers <a :href="withBase(target.link)">la semaine en cours</a>…
  </p>
  <p v-else>Aucune semaine programmée.</p>
</template>
