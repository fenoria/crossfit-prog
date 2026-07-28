---
name: generate-training-cycle
description: Génère saison/macro/meso/semaines en Markdown sous prog/, uniquement si la méthodo est validée. Use when generating a training cycle, mesocycle, microcycle, or weekly program.
---

# Generate training cycle

## Preconditions
- `knowledge/methodology.md` statut **validated**
- Lire `athlete/profile.yaml` + dernières pages dans `prog/`
- Respecter planning 90 min, box only, Z2>off, adducteur
- Vérifier **gates** (`knowledge/meso-gates.yaml`, scope Macro 1) avant meso suivant
- Ops : maintenance-doses, session-patterns, conditioning-matrix, warmups, gym-ladder
- Code meso : `REAL` (pas `REAL-mini` comme clé)

## Steps
1. Définir objectif / date (ou Build sans A-event).
2. Assurer Saison → Macrocycle → Meso (`index.md` ; meso depuis `prog/_templates/meso.md`).
3. Écrire les semaines depuis `prog/_templates/semaine.md` :
   - texte athlète (échauffements écrits) ;
   - `<!-- pattern: -->` / `<!-- warmup: -->` pour ops ;
   - fondements + feedback.
4. Samedi = optionnel (décider à l’écriture / J-1 selon dispo).
5. Microcycle Israetel : volume → surcharge → pic → deload.
6. Mettre à jour index + `.vitepress/current.json`.
7. Noter arbitrages dans `history/decisions.md`.
8. **Obligatoire** : `npm run lint:prog` — zéro ERROR.
