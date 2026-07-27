import { defineConfig, type DefaultTheme } from 'vitepress'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const progDir = join(rootDir, '..', 'prog')
const repoBase = process.env.VITEPRESS_BASE || '/'

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
  if (!existsSync(currentPath)) return '/saison-2026/'
  try {
    const data = JSON.parse(readFileSync(currentPath, 'utf8')) as { week?: string }
    return data.week || '/saison-2026/'
  } catch {
    return '/saison-2026/'
  }
}

function buildDirItems(dir: string): DefaultTheme.SidebarItem[] {
  if (!existsSync(dir)) return []
  const entries = sortEntries(readdirSync(dir))
  const items: DefaultTheme.SidebarItem[] = []

  for (const name of entries) {
    if (name.startsWith('.')) continue
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

const sidebarItems: DefaultTheme.SidebarItem[] = [
  { text: 'Accueil', link: '/' },
  ...buildDirItems(progDir),
]

export default defineConfig({
  title: 'Prog CrossFit',
  description: 'Programmation CrossFit élite — source Markdown',
  lang: 'fr-FR',
  srcDir: 'prog',
  base: repoBase,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Saison 2026', link: '/saison-2026/' },
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
  ],
})
