import { onMounted, watch, type Ref } from 'vue'

export function useToolStorage<T extends string | number | boolean>(
  refVariable: Ref<T>,
  storageKey: string,
) {
  onMounted(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored === null) return

    if (typeof refVariable.value === 'boolean') {
      refVariable.value = (stored === 'true') as T
    } else if (typeof refVariable.value === 'number') {
      const n = Number(stored)
      if (!Number.isNaN(n)) refVariable.value = n as T
    } else {
      refVariable.value = stored as T
    }
  })

  watch(refVariable, (newValue) => {
    localStorage.setItem(storageKey, String(newValue))
  })
}
