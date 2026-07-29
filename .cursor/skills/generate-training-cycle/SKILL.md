---
name: generate-training-cycle
description: Génère saison/macro/meso/semaines en Markdown sous prog/, uniquement si la méthodo est validée. Use when generating a training cycle, mesocycle, microcycle, or weekly program.
---

# Generate training cycle

## Preconditions
- `knowledge/methodology.md` statut **validated**
- Lire `athletes/current.yaml` → profil `athletes/<id>/profile.yaml` + dernières pages dans `prog/`
- Respecter `schedule` / `equipment` / préférences du profil ; % sur `prs_current_kg` (jamais `prs_pre_injury_kg` si présent)
- Vérifier **gates** (`knowledge/meso-gates.yaml`, scope Macro 1) avant meso suivant
- Ops : maintenance-doses, session-patterns, conditioning-matrix, warmups, gym-ladder
- Code meso : `REAL` (pas `REAL-mini` comme clé)
- Ne pas réécrire le contenu des semaines déjà commencées / passées (mise en forme OK)

## Steps
1. Définir objectif / date (ou Build sans A-event).
2. Assurer Saison → Macrocycle → Meso (`index.md` ; macro `macrocycle-NN-<slug>/` ; meso `meso-NN-<slug>/` depuis `prog/_templates/meso.md`).
3. Écrire les semaines depuis `prog/_templates/semaine.md` :
   - texte athlète (échauffements écrits) ;
   - `<!-- pattern: -->` / `<!-- warmup: -->` pour ops ;
   - fondements + feedback.
4. Samedi selon profil (décider à l’écriture / J-1 selon dispo).
5. Microcycle Israetel : volume → surcharge → pic → deload.
6. Mettre à jour index + `.vitepress/current.json`.
7. Arbitrage durable → profil athlète actif (ou `knowledge/arbitrages.md` si conflit corpus).
8. **Obligatoire** : `npm run lint:prog` — zéro ERROR.
