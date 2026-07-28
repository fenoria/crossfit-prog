---
name: generate-training-cycle
description: Génère saison/macro/meso/semaines en Markdown sous prog/, uniquement si la méthodo est validée. Use when generating a training cycle, mesocycle, microcycle, or weekly program.
---

# Generate training cycle

## Preconditions
- `knowledge/methodology.md` statut **validated**
- Lire `athlete/profile.yaml` + dernières pages dans `prog/`
- Respecter planning 90 min, box only, Z2>off, adducteur

## Steps
1. Définir objectif / date (ou Build sans A-event).
2. Assurer Saison → Macrocycle → Meso (`index.md` à chaque niveau).
3. Écrire les semaines `Sxx-YYYY-MM-DD.md` depuis [`prog/_templates/semaine.md`](prog/_templates/semaine.md) (pédagogie + Fondements corpus, 1–3 refs).
4. Mettre à jour les index + `.vitepress/current.json`.
5. Noter arbitrages dans `history/decisions.md`.
6. Site VitePress : sidebar auto depuis `prog/` — rien à éditer dans la config.
