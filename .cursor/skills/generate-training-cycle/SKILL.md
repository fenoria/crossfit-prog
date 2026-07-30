---
name: generate-training-cycle
description: Génère saison/macro/meso/semaines en Markdown sous prog/, uniquement si la méthodo est validée. Use when generating a training cycle, mesocycle, microcycle, or weekly program.
---

# Generate training cycle

Règles : **`.cursor/rules/prog-writing.mdc`**.

## Preconditions
- `knowledge/methodology.md` **validated**
- Profil actif + dernières pages `prog/`
- Gates : `knowledge/meso-gates.yaml` avant meso suivant
- Ops : maintenance-doses, session-patterns, conditioning-matrix, warmups, gym-ladder

## Steps
1. Objectif / date (ou Build sans A-event).
2. Saison → Macro (`macrocycle-NN-<slug>/`) → Meso (`meso-NN-<slug>/`, template meso).
3. Semaines depuis `prog/_templates/semaine.md` : pattern/warmup comments, fondements, feedback.
4. Microcycle Israetel : volume → surcharge → pic → deload.
5. Index + `.vitepress/current.json` ; arbitrage → profil ou `knowledge/arbitrages.md`.
6. **Obligatoire** : `npm run lint:prog` — zéro ERROR.

Pour le détail semaine par semaine, enchaîner avec skill **write-week**.
