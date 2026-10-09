import { defineConfig, type DefaultTheme } from 'vitepress'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const progDir = join(rootDir, '..', 'prog')
const repoBase = process.env.VITEPRESS_BASE || '/'

/** Version des icônes (empreinte écrite par `npm run build:icons`) : ajoutée en `?v=` pour contourner les caches. */
const iconVersion: string = JSON.parse(readFileSync(join(rootDir, 'icons.json'), 'utf8')).version
const icon = (path: string) => `${asset(path)}?v=${iconVersion}`

/** Absolute public asset path, respecting `base` (e.g. GitHub Pages subpath). */
function asset(path: string): string {
  const base = repoBase.endsWith('/') ? repoBase.slice(0, -1) : repoBase
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function mdTitle(filePath: string, fallback: string): string {
  try {
    const text = readFileSync(filePath, 'utf8')
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (fm) {
      const titleLine = fm[1].match(/^title:\s*(.+)$/m)
      if (titleLine) return titleLine[1].trim().replace(/^['"]|['"]$/g, '')
    }
    const match = text.match(/^#\s+(.+)$/m)
    if (match) return match[1].trim()
  } catch {
    /* ignore */
  }
  return fallback
}

/** Abréviations mois — sidebar uniquement (titres de page inchangés). */
const SIDEBAR_MONTH_ABBR: [RegExp, string][] = [
  [/\bjanvier\b/gi, 'janv'],
  [/\bfévrier\b/gi, 'févr'],
  [/\bjuillet\b/gi, 'juil'],
  [/\bseptembre\b/gi, 'sept'],
  [/\boctobre\b/gi, 'oct'],
  [/\bnovembre\b/gi, 'nov'],
  [/\bdécembre\b/gi, 'déc'],
  [/\bavril\b/gi, 'avr'],
]

function abbreviateMonthsForSidebar(label: string): string {
  for (const [re, abbr] of SIDEBAR_MONTH_ABBR) {
    label = label.replace(re, abbr)
  }
  return label
}

/** Libellé sidebar uniquement — pages gardent le titre Markdown complet. */
function sidebarLabel(title: string, entryName?: string): string {
  let label = title.replace(/\bMacrocycle\b/g, 'Macro')
  label = abbreviateMonthsForSidebar(label)
  const mesoNum = entryName?.match(/^meso-(\d+)/i)
  if (mesoNum) {
    label = label.replace(/^Meso\b/, `Meso ${Number(mesoNum[1])}`)
  }
  return label
}

function toLink(absPath: string): string {
  const rel = relative(progDir, absPath).split(sep).join('/')
  if (rel === 'index.md') return '/'
  if (rel.endsWith('/index.md')) return `/${rel.slice(0, -'/index.md'.length)}/`
  return `/${rel.replace(/\.md$/, '')}`
}

function sortEntries(names: string[]): string[] {
  return names.sort((a, b) => {
    if (a === 'index.md') return -1
    if (b === 'index.md') return 1
    // macrocycle-01 before macrocycle-02…
    const ac = a.match(/^macrocycle-(\d+)/i)
    const bc = b.match(/^macrocycle-(\d+)/i)
    if (ac && bc) return Number(ac[1]) - Number(bc[1])
    // meso-01 before meso-02…
    const am = a.match(/^meso-(\d+)/i)
    const bm = b.match(/^meso-(\d+)/i)
    if (am && bm) return Number(am[1]) - Number(bm[1])
    // S01 before S02… then alpha
    const as = a.match(/^S(\d+)/i)
    const bs = b.match(/^S(\d+)/i)
    if (as && bs) return Number(as[1]) - Number(bs[1])
    return a.localeCompare(b, 'fr')
  })
}

/** Semaine programmée : lien + lundi (ISO) tiré du nom `Sxx-YYYY-MM-DD.md`. */
export interface WeekEntry {
  link: string
  start: string
}

const WEEK_FILE = /^S\d+-(\d{4}-\d{2}-\d{2})\.md$/

function collectWeeks(dir: string): WeekEntry[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name: string) => {
    if (name.startsWith('.') || name.startsWith('_') || name === 'public') return []
    const abs = join(dir, name)
    if (statSync(abs).isDirectory()) return collectWeeks(abs)
    const match = name.match(WEEK_FILE)
    return match ? [{ link: toLink(abs), start: match[1] }] : []
  })
}

/** Toutes les semaines, triées par date de début. */
const weeks: WeekEntry[] = collectWeeks(progDir).sort((a, b) => a.start.localeCompare(b.start))

/** Semaine couvrant `today` (sinon la dernière commencée, sinon la première). */
function weekFor(today: string): WeekEntry | null {
  let found: WeekEntry | null = null
  for (const week of weeks) {
    if (week.start <= today) found = week
  }
  return found ?? weeks[0] ?? null
}

function seasonFromLink(link: string): string | null {
  const match = link.match(/\/?(saison-\d{4})\b/)
  return match ? match[1] : null
}

function seasonDirsNewestFirst(): string[] {
  if (!existsSync(progDir)) return []
  return readdirSync(progDir)
    .filter((name: string) => name.startsWith('saison-'))
    .filter((name: string) => statSync(join(progDir, name)).isDirectory())
    .sort((a: string, b: string) => b.localeCompare(a, 'fr'))
}

function defaultSeasonLink(): string {
  const seasons = seasonDirsNewestFirst()
  if (seasons.length === 0) return '/'
  return `/${seasons[0]}/`
}

/** Analytics de la saison la plus récente qui a une page `analytics.md` (sinon l'accueil). */
function analyticsLink(): string {
  const season = seasonDirsNewestFirst().find((name: string) => existsSync(join(progDir, name, 'analytics.md')))
  return season ? `/${season}/analytics` : '/'
}

function buildDirItems(dir: string): DefaultTheme.SidebarItem[] {
  if (!existsSync(dir)) return []
  const entries = sortEntries(readdirSync(dir))
  const items: DefaultTheme.SidebarItem[] = []

  for (const name of entries) {
    // Skip hidden / template dirs and VitePress static assets (`prog/public`)
    if (name.startsWith('.') || name.startsWith('_') || name === 'public') continue
    const abs = join(dir, name)
    const st = statSync(abs)

    if (st.isDirectory()) {
      const indexPath = join(abs, 'index.md')
      const childItems = buildDirItems(abs)
      const text = sidebarLabel(
        existsSync(indexPath) ? mdTitle(indexPath, name) : name,
        name,
      )
      const overview = existsSync(indexPath)
        ? [{ text: 'Vue d’ensemble', link: toLink(indexPath) }]
        : []
      items.push({
        text,
        collapsed: true,
        items: [...overview, ...childItems],
      })
      continue
    }

    if (!name.endsWith('.md') || name === 'index.md') continue
    items.push({
      text: sidebarLabel(mdTitle(abs, basename(name, '.md')), name),
      link: toLink(abs),
    })
  }

  return items
}

function buildSeasonItems(currentSeason: string | null): DefaultTheme.SidebarItem[] {
  if (!existsSync(progDir)) return []
  return seasonDirsNewestFirst()
    .flatMap((name) => {
      const abs = join(progDir, name)
      if (!statSync(abs).isDirectory()) return []
      const indexPath = join(abs, 'index.md')
      const text = sidebarLabel(existsSync(indexPath) ? mdTitle(indexPath, name) : name)
      const overview = existsSync(indexPath)
        ? [{ text: 'Vue d’ensemble', link: toLink(indexPath) }]
        : []
      return [
        {
          text,
          // Seule la saison en cours (date du build) reste ouverte
          collapsed: name !== currentSeason,
          items: [...overview, ...buildDirItems(abs)],
        },
      ]
    })
}

const TIMER_URL = 'https://timer.fenoria.fr'

const buildWeek = weekFor(new Date().toISOString().slice(0, 10))
const currentSeason = buildWeek ? seasonFromLink(buildWeek.link) : null
const livresDir = join(progDir, 'livres')
const outilsDir = join(progDir, 'outils')
const outilsItems: DefaultTheme.SidebarItem[] = [
  {
    text: 'Timer',
    link: TIMER_URL,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  ...buildDirItems(outilsDir),
]

const sidebarItems: DefaultTheme.SidebarItem[] = [
  ...buildSeasonItems(currentSeason),
  {
    text: 'Outils',
    collapsed: false,
    items: outilsItems,
  },
  {
    text: 'Référentiel',
    collapsed: true,
    items: [
      { text: 'Concepts', link: '/livres/concepts' },
      {
        text: 'Livres',
        collapsed: true,
        items: [
          ...(existsSync(join(livresDir, 'index.md'))
            ? [{ text: 'Vue d’ensemble', link: '/livres/' }]
            : []),
          ...buildDirItems(livresDir).filter(
            (item) => !('link' in item && item.link === '/livres/concepts'),
          ),
        ],
      },
    ],
  },
]

export default defineConfig({
  title: 'Prog T. Maxel',
  description: 'Programmation CrossFit élite',
  lang: 'fr-FR',
  srcDir: 'prog',
  base: repoBase,
  cleanUrls: true,
  appearance: 'dark',
  transformPageData(pageData) {
    if (pageData.relativePath.startsWith('outils/') || pageData.relativePath.endsWith('/analytics.md')) {
      pageData.frontmatter.aside = false
    }
  },
  themeConfig: {
    // Lu côté client par <CurrentWeekRedirect> (page /en-cours)
    weeks,
    // VitePress prefixes `themeConfig.logo` with `base` automatically.
    logo: { src: '/logo.svg', alt: 'Prog T. Maxel' },
    siteTitle: 'Prog T. Maxel',
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Concepts', link: '/livres/concepts' },
      { text: 'Livres', link: '/livres/' },
      {
        text: 'Outils',
        items: outilsItems,
      },
      { text: 'Saisons', link: defaultSeasonLink() },
      { text: 'Analytics', link: analyticsLink() },
      { text: 'En cours', link: '/en-cours' },
    ],
    sidebar: {
      '/': sidebarItems,
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
          modal: {
            noResultsText: 'Aucun résultat',
            resetButtonTitle: 'Réinitialiser',
            footer: { selectText: 'Sélectionner', navigateText: 'Naviguer' },
          },
        },
      },
    },
    outline: {
      label: 'Sur cette page',
      level: [2, 3],
    },
    docFooter: {
      prev: 'Précédent',
      next: 'Suivant',
    },
    darkModeSwitchLabel: 'Apparence',
    lightModeSwitchTitle: 'Mode clair',
    darkModeSwitchTitle: 'Mode sombre',
    returnToTopLabel: 'Retour en haut',
    sidebarMenuLabel: 'Menu',
  },
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
    ['link', { rel: 'icon', href: icon('/favicon.ico'), sizes: '48x48' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: icon('/favicon.svg'), sizes: 'any' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: icon('/favicon-32x32.png') }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: icon('/favicon-16x16.png') }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: icon('/apple-touch-icon.png') }],
    ['link', { rel: 'manifest', href: icon('/site.webmanifest') }],
    ['link', { rel: 'mask-icon', href: asset('/safari-pinned-tab.svg'), color: '#ff7edb' }],
    ['meta', { name: 'theme-color', content: '#262335' }],
    ['meta', { name: 'msapplication-TileColor', content: '#262335' }],
    ['meta', { name: 'author', content: 'Thierry Maxel' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Prog T. Maxel' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Programmation CrossFit élite',
      },
    ],
    ['meta', { property: 'og:locale', content: 'fr_FR' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'Prog T. Maxel' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'Programmation CrossFit élite',
      },
    ],
  ],
})
