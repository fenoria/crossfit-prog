#!/usr/bin/env node
/**
 * Génère les icônes du site (favicons, iOS, PWA) depuis les SVG de prog/public/.
 *
 * Sources  : logo.svg (marque complète) et favicon.svg (version simplifiée, petites tailles).
 * Sorties  : prog/public/favicon.ico (16/32/48), favicon-16x16.png, favicon-32x32.png,
 *            apple-touch-icon.png (180, opaque, plein cadre), icons/icon-{192,512}.png (« any »),
 *            icons/icon-maskable-{192,512}.png (plein cadre, zone de sécurité) ;
 *            réécrit les icônes de site.webmanifest et écrit .vitepress/icons.json (version des URLs).
 * Version  : empreinte du contenu — ajoutée en `?v=` aux URLs, donc tout changement d'icône change
 *            le manifeste et force la mise à jour des applis installées.
 * Règles   : .claude/rules/svg-utf8.md · Usage : npm run build:icons
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'prog', 'public')
const BG = '#262335' // fond SynthWave (= theme_color du manifeste)

const read = (name) => readFileSync(join(pub, name), 'utf8')
/** Contenu interne d'un SVG + son viewBox, pour le réutiliser dans une composition. */
function parts(svg) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1]
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  return { viewBox, inner }
}
const logo = parts(read('logo.svg'))
const mini = parts(read('favicon.svg'))

/** Marque centrée dans un carré de 100 unités, occupant `scale` (0–1) de la largeur. */
function mark(p, scale) {
  const size = 100 * scale
  const off = (100 - size) / 2
  return `<svg x="${off}" y="${off}" width="${size}" height="${size}" viewBox="${p.viewBox}">${p.inner}</svg>`
}
const canvas = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`

/** Recettes : une icône dédiée par usage (voir les consignes de chaque plateforme). */
const recipes = {
  // Onglet / favicon : fond transparent, version simplifiée lisible à 16 px
  favicon: canvas(mark(mini, 0.94)),
  // iOS : carré opaque plein cadre (iOS applique lui-même le masque arrondi et remplit la transparence en noir)
  apple: canvas(`<rect width="100" height="100" fill="${BG}"/>${mark(logo, 0.7)}`),
  // Android / PWA « any » : coins arrondis, marque large
  any: canvas(`<rect width="100" height="100" rx="22" fill="${BG}"/>${mark(logo, 0.74)}`),
  // PWA « maskable » : plein cadre, marque dans la zone de sécurité (disque central de 80 % → marque ≤ 62 %)
  maskable: canvas(`<rect width="100" height="100" fill="${BG}"/>${mark(logo, 0.6)}`),
}

const png = (svg, size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size }, shapeRendering: 2, textRendering: 2 }).render().asPng()

/** ICO multi-tailles (frames PNG, pris en charge par tous les navigateurs modernes). */
function ico(frames) {
  const head = Buffer.alloc(6)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(frames.length, 4)
  let offset = 6 + 16 * frames.length
  const entries = frames.map(({ size, data }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4) // plans
    e.writeUInt16LE(32, 6) // bits par pixel
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    return e
  })
  return Buffer.concat([head, ...entries, ...frames.map((f) => f.data)])
}

mkdirSync(join(pub, 'icons'), { recursive: true })
const outputs = {
  'favicon-16x16.png': png(recipes.favicon, 16),
  'favicon-32x32.png': png(recipes.favicon, 32),
  'apple-touch-icon.png': png(recipes.apple, 180),
  'icons/icon-192.png': png(recipes.any, 192),
  'icons/icon-512.png': png(recipes.any, 512),
  'icons/icon-maskable-192.png': png(recipes.maskable, 192),
  'icons/icon-maskable-512.png': png(recipes.maskable, 512),
  'favicon.ico': ico([16, 32, 48].map((size) => ({ size, data: png(recipes.favicon, size) }))),
}

const hash = createHash('sha256').update(read('logo.svg')).update(read('favicon.svg'))
for (const [name, data] of Object.entries(outputs)) {
  writeFileSync(join(pub, name), data)
  hash.update(name).update(data)
}
const version = hash.digest('hex').slice(0, 8)

// Manifeste : seules les icônes sont réécrites ; ?v= force la détection de mise à jour
const manifestPath = join(pub, 'site.webmanifest')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
manifest.icons = [
  { src: `icons/icon-192.png?v=${version}`, sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: `icons/icon-512.png?v=${version}`, sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: `icons/icon-maskable-192.png?v=${version}`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
  { src: `icons/icon-maskable-512.png?v=${version}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
]
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
writeFileSync(join(root, '.vitepress', 'icons.json'), JSON.stringify({ version }, null, 2) + '\n')

console.log(`icônes : ${Object.keys(outputs).length} fichiers, version ${version}`)
