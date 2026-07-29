import { defineConfig, type DefaultTheme } from 'vitepress'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const progDir = join(rootDir, '..', 'prog')
const repoBase = process.env.VITEPRESS_BASE || '/'

/** Absolute public asset path, respecting `base` (e.g. GitHub Pages subpath). */
function asset(path: string): string {
  const base = repoBase.endsWith('/') ? repoBase.slice(0, -1) : repoBase
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function mdTitle(filePath: string, fallback: string): string {
  try {
    const text = readFileSync(filePath, 'utf8')
    const match = text.match(/^#\s+(.+)$/m)
    if (match) return match[1].trim()
  } catch {
    /* ignore */
  }
  return fallback
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
    // S01 before S02… then alpha
    const as = a.match(/^S(\d+)/i)
    const bs = b.match(/^S(\d+)/i)
    if (as && bs) return Number(as[1]) - Number(bs[1])
    return a.localeCompare(b, 'fr')
  })
}

function loadCurrentWeekLink(): string {
  const currentPath = join(rootDir, 'current.json')
  const fallback = defaultSeasonLink()
  if (!existsSync(currentPath)) return fallback
  try {
    const data = JSON.parse(readFileSync(currentPath, 'utf8')) as { week?: string }
    return data.week || fallback
  } catch {
    return fallback
  }
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
  if (seasons.length === 0) return '/saisons/'
  return `/${seasons[0]}/`
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
      const text = existsSync(indexPath) ? mdTitle(indexPath, name) : name
      const overview = existsSync(indexPath)
        ? [{ text: 'Vue d’ensemble', link: toLink(indexPath) }]
        : []
      items.push({
        text,
        collapsed: false,
        items: [...overview, ...childItems],
      })
      continue
    }

    if (!name.endsWith('.md') || name === 'index.md') continue
    items.push({
      text: mdTitle(abs, basename(name, '.md')),
      link: toLink(abs),
    })
  }

  return items
}

function buildSeasonItems(): DefaultTheme.SidebarItem[] {
  if (!existsSync(progDir)) return []
  return seasonDirsNewestFirst()
    .flatMap((name) => {
      const abs = join(progDir, name)
      if (!statSync(abs).isDirectory()) return []
      const indexPath = join(abs, 'index.md')
      const text = existsSync(indexPath) ? mdTitle(indexPath, name) : name
      const overview = existsSync(indexPath)
        ? [{ text: 'Vue d’ensemble', link: toLink(indexPath) }]
        : []
      return [
        {
          text,
          collapsed: false,
          items: [...overview, ...buildDirItems(abs)],
        },
      ]
    })
}

const livresDir = join(progDir, 'livres')
const saisonsHub = join(progDir, 'saisons', 'index.md')

const sidebarItems: DefaultTheme.SidebarItem[] = [
  { text: 'Accueil', link: '/' },
  {
    text: 'Référentiel',
    collapsed: false,
    items: [
      { text: 'Concepts', link: '/livres/concepts' },
      {
        text: 'Livres',
        collapsed: false,
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
  {
    text: 'Saisons',
    collapsed: false,
    items: [
      ...(existsSync(saisonsHub)
        ? [{ text: 'Hub saisons', link: '/saisons/' }]
        : []),
      ...buildSeasonItems(),
    ],
  },
]

export default defineConfig({
  title: 'Prog CrossFit',
  description: 'Programmation CrossFit élite',
  lang: 'fr-FR',
  srcDir: 'prog',
  base: repoBase,
  cleanUrls: true,
  appearance: 'dark',
  themeConfig: {
    // VitePress prefixes `themeConfig.logo` with `base` automatically.
    logo: { src: '/logo.svg', alt: 'Prog CrossFit' },
    siteTitle: 'Prog CrossFit',
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Concepts', link: '/livres/concepts' },
      { text: 'Livres', link: '/livres/' },
      { text: 'Saisons', link: '/saisons/' },
      { text: 'En cours', link: loadCurrentWeekLink() },
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
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@600;700;800&display=swap',
      },
    ],
    ['link', { rel: 'icon', href: asset('/favicon.ico'), sizes: 'any' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: asset('/favicon.svg') }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: asset('/favicon-32x32.png') }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: asset('/favicon-16x16.png') }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: asset('/apple-touch-icon.png') }],
    ['link', { rel: 'manifest', href: asset('/site.webmanifest') }],
    ['link', { rel: 'mask-icon', href: asset('/safari-pinned-tab.svg'), color: '#64ffda' }],
    ['meta', { name: 'theme-color', content: '#0b1426' }],
    ['meta', { name: 'msapplication-TileColor', content: '#0b1426' }],
    ['meta', { name: 'author', content: 'Thierry Maxel' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Prog CrossFit' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Programmation CrossFit élite',
      },
    ],
    ['meta', { property: 'og:locale', content: 'fr_FR' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'Prog CrossFit' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'Programmation CrossFit élite',
      },
    ],
  ],
})
