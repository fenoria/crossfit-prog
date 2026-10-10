import { ref } from 'vue'

export interface TipState {
  visible: boolean
  x: number
  y: number
  title: string
  lines: string[]
}

/** Info-bulle partagée par les graphes analytics (texte brut, pas de HTML). */
export function useTip() {
  const tip = ref<TipState>({ visible: false, x: 0, y: 0, title: '', lines: [] })

  function show(e: MouseEvent | PointerEvent, title: string, lines: string[] = []) {
    tip.value = { visible: true, x: e.clientX, y: e.clientY, title, lines: lines.filter(Boolean) }
  }

  function hide() {
    tip.value.visible = false
  }

  return { tip, show, hide }
}

export const fr = (v: number | string) => String(v).replace('.', ',')
