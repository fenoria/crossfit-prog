# Prog CrossFit

Programmation CrossFit élite — **source de vérité = [`prog/`](prog/)** (Markdown).

## Stack

| Couche | Rôle |
|---|---|
| Connaissance | [`knowledge/`](knowledge/) (+ [`books/`](books/) brut) |
| Instance | [`athlete/profile.yaml`](athlete/profile.yaml) |
| Séances | [`prog/`](prog/) — **SoT programmation** |
| Mémoire | [`history/decisions.md`](history/decisions.md) |
| Site | **VitePress** → GitHub Pages |
| En cours | [`.vitepress/current.json`](.vitepress/current.json) |

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

Feedback séance → blocs **Notes / feedback** (un jour = un titre) dans la semaine `prog/` + éventuellement `.vitepress/current.json`.  
Décisions durables : [`history/decisions.md`](history/decisions.md).  
Ops pack : `knowledge/maintenance-doses.yaml`, `meso-gates.yaml`, `gym-ladder.md`, etc. · lint : `npm run lint:prog`
