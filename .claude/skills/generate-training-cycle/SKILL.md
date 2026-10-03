---
name: generate-training-cycle
description: Génère saison/macro/meso/semaines en Markdown sous prog/, uniquement si la méthodo est validée. À utiliser pour générer un cycle d’entraînement, un mésocycle, un microcycle ou un programme hebdo.
---

# Generate training cycle

Règles : **`.claude/rules/prog-writing.md`**.

## Preconditions
- `knowledge/methodology.yaml` **validated** ; `methodology.md` : sections architecture (§3) et domaines (§5) utiles au cycle
- Profil actif + `knowledge/instances/<saison>.yaml` + journal des dernières semaines (pas les semaines `prog/` complètes)
- Gates : `knowledge/meso-gates.yaml` avant meso suivant
- Ops : maintenance-doses, session-patterns, conditioning-matrix, warmups, gym-ladder

## Steps
1. Objectif / date (ou Build sans A-event).
2. Saison → Macro (`macrocycle-NN-<slug>/`) → Meso (`meso-NN-<slug>/`, template meso).
3. Semaines depuis `prog/_templates/semaine.md` : pattern/warmup comments, fondements, feedback.
4. Microcycle Israetel : volume → surcharge → pic → deload.
5. Index (« En cours » = auto par date) ; calendrier (fenêtres, semaines, mesures) → `knowledge/instances/<saison>.yaml` uniquement ; arbitrage → profil ou `knowledge/arbitrages.md`.
6. **Obligatoire** : `npm run lint:prog` — zéro ERROR.

Pour le détail semaine par semaine, enchaîner avec skill **write-week**.
