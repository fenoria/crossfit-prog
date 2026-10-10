import { useData } from 'vitepress'

// Un fichier de données par saison : analytics/data/<saison>.json (voir scripts/build-analytics.py).
// Vite les inclut tous ; on choisit d'après le dossier de la page (prog/saison-2026/analytics.md → saison-2026).
const files = import.meta.glob('./data/*.json', { eager: true, import: 'default' }) as Record<string, any>

/** Numéro de semaine calendaire (ISO) de la semaine d'index `i`, sur 2 chiffres : « 41 ». */
export const weekNo = (data: any, i: number): string => String(data.weeks[i]?.iso ?? i + 1).padStart(2, '0')

export function useSeasonData(): any {
  const { page } = useData()
  const season = page.value.relativePath.split('/')[0]
  const key = Object.keys(files).find((k) => k.endsWith(`/${season}.json`))
  if (!key) {
    throw new Error(`analytics : pas de données pour « ${season} » — lancer npm run build:analytics`)
  }
  return files[key]
}
