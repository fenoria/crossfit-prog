import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Largeur utile (px) d'un graphe SVG : on la mesure pour que le viewBox soit à l'échelle 1:1.
 * Le texte garde ainsi une taille constante, et c'est le nombre de semaines affichées qui s'adapte.
 * `pad` = padding + bordure de la carte qui contient le SVG.
 */
export function useChartWidth(box: Ref<HTMLElement | null>, fallback = 560, pad = 34) {
  const width = ref(fallback)
  let observer: ResizeObserver | undefined

  const measure = () => {
    if (box.value) width.value = Math.max(240, Math.floor(box.value.clientWidth - pad))
  }

  onMounted(() => {
    measure()
    if (typeof ResizeObserver !== 'undefined' && box.value) {
      observer = new ResizeObserver(measure)
      observer.observe(box.value)
    }
  })
  onBeforeUnmount(() => observer?.disconnect())

  return width
}
