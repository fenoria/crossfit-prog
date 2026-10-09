---
paths:
  - "prog/public/**/*.svg"
---

# SVG publics (`prog/public/**/*.svg`)

Quand on crée ou modifie un schéma SVG pour le site :

1. **UTF-8 strict** — fichier réellement encodé UTF-8, sans BOM  
   - En-tête obligatoire : `<?xml version="1.0" encoding="UTF-8"?>`  
   - Texte FR naturel OK (accents, tirets) tant que le fichier est UTF-8 réel  
   - Écrire via Python `Path.write_text(..., encoding="utf-8")` (ou `write_bytes(text.encode("utf-8"))`)  
   - Interdit : octets Windows-1252 / Latin-1, BOM

2. **XML bien formé** — après écriture : `npm run lint:prog`

3. **Chemins sans collision VitePress**  
   - Concepts génériques → `prog/public/concepts/…` (URL `/concepts/…`)  
   - Schémas de saison → `prog/public/diagrams/saison-YYYY/…` (URL `/diagrams/saison-YYYY/…`)  
   - **Jamais** `prog/public/saison-YYYY/` : collision avec la page Markdown `/saison-YYYY/`

4. Après génération : `npm run lint:prog`

5. **Icônes** : après modification de `logo.svg` ou `favicon.svg` (favicon.svg = version simplifiée pour 16–48 px), lancer `npm run build:icons` — il régénère favicons, `apple-touch-icon.png`, icônes PWA (`icons/`, « any » + « maskable »), le manifeste et la version `?v=` des URLs (`.vitepress/icons.json`) ; commiter le tout. Ne pas éditer les PNG à la main.
