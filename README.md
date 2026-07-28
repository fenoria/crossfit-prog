# Prog CrossFit

Programmation CrossFit élite — **source de vérité = [`prog/`](prog/)** (Markdown).

## Stack

| | |
|---|---|
| Méthodo | [`knowledge/methodology.md`](knowledge/methodology.md) |
| Profil | [`athlete/profile.yaml`](athlete/profile.yaml) |
| Livres | [`books/`](books/) (gitignorés) |
| Site | **VitePress** (Vue) → GitHub Pages |
| Semaine en cours | [`.vitepress/current.json`](.vitepress/current.json) |

## Hiérarchie

```text
prog/
  saison-2026/
    macrocycle-1-build/
      meso-benchmarks/
        S01-….md        ← 1 fichier = 1 semaine
.vitepress/current.json ← lien nav « En cours »
```

## Dev local

```bash
npm install
npm run dev          # alias docs:dev → http://localhost:5173
npm run docs:build
npm run ingest       # ré-extraire books/ → knowledge/raw/
npm run lint:prog    # garde-fou structure prog/
```

## GitHub Pages

1. Push le repo  
2. Settings → Pages → Source : **GitHub Actions**  
3. URL : `https://<user>.github.io/<repo>/`

## Coaching

Feedback séance → tableau **Notes / feedback** dans la semaine `prog/` + éventuellement `.vitepress/current.json`.  
Décisions durables : [`history/decisions.md`](history/decisions.md).  
Ops pack : `knowledge/maintenance-doses.yaml`, `meso-gates.yaml`, `gym-ladder.md`, etc. · lint : `npm run lint:prog`
