---
name: generate-training-cycle
description: Génère saison/macro/meso/semaines en Markdown sous prog/, uniquement si la méthodo est validée. Use when generating a training cycle, mesocycle, microcycle, or weekly program.
---

# Generate training cycle

## Preconditions
- `knowledge/methodology.md` statut **validated**
- Lire `athlete/profile.yaml` + dernières pages dans `prog/`
- Respecter planning 90 min, box only, Z2>off, adducteur
- Vérifier **gates** (`knowledge/meso-gates.yaml`) avant de passer au meso suivant
- Ops : maintenance-doses, session-patterns, conditioning-matrix, warmups, gym-ladder

## Steps
1. Définir objectif / date (ou Build sans A-event).
2. Assurer Saison → Macrocycle → Meso (`index.md` ; meso depuis `prog/_templates/meso.md`).
3. Ancrer calendrier samedi ON/OFF dans l’index macro.
4. Écrire les semaines depuis `prog/_templates/semaine.md` (patterns + warmups + fondements + feedback table).
5. Microcycle Israetel dans le meso : volume → surcharge → pic → deload.
6. Mettre à jour index + `.vitepress/current.json`.
7. Noter arbitrages dans `history/decisions.md`.
8. `npm run lint:prog` si dispo.
