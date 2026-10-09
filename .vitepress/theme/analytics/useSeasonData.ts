import { useData } from 'vitepress'

// Un fichier de données par saison : analytics/data/<saison>.json (voir scripts/build-analytics.py).
// Vite les inclut tous ; on choisit d'après le dossier de la page (prog/saison-2026/analytics.md → saison-2026).
const files = import.meta.glob('./data/*.json', { eager: true, import: 'default' }) as Record<string, any>

export function useSeasonData(): any {
  const { page } = useData()
  const season = page.value.relativePath.split('/')[0]
  const key = Object.keys(files).find((k) => k.endsWith(`/${season}.json`))
  if (!key) {
    throw new Error(`analytics : pas de données pour « ${season} » — lancer npm run build:analytics`)
  }
  return files[key]
}
