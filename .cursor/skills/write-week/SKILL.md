---
name: write-week
description: Écrit ou met à jour une semaine d’entraînement en Markdown sous prog/ (Saison→Macro→Meso→Semaine). Use when creating a training week, mesocycle, macrocycle, or updating the program site content.
---

# Write week (prog/)

## Source de vérité
[`prog/`](prog/) — hiérarchie Saison → Macrocycle → Meso → Semaine.  
Sidebar VitePress = **auto** (arborescence `prog/`).

## Template forme
- Semaine : [`prog/_templates/semaine.md`](prog/_templates/semaine.md)
- Meso (si nouveau) : [`prog/_templates/meso.md`](prog/_templates/meso.md)

## Preconditions
- `knowledge/methodology.md` status **validated**
- Lire `athlete/profile.yaml` + dernières semaines du même meso
- Relire fiches livres + `knowledge/arbitrages.md` pertinentes
- Relire ops pack :
  - `knowledge/maintenance-doses.yaml` (code meso ; `REAL-mini` → `REAL`)
  - `knowledge/session-patterns.yaml` (ids obligatoires)
  - `knowledge/warmups.yaml`
  - `knowledge/gym-ladder.md` si ACC-GYM
  - `knowledge/meso-gates.yaml` si changement de meso (scope Macro 1)
  - `knowledge/adductor-protocol.yaml` / `conditioning-matrix.yaml`
- Samedi : optionnel (décider selon dispo)

## Steps
1. Assurer les `index.md` Saison / Macro / Meso (meso depuis template meso).
2. Créer/mettre à jour `Sxx-YYYY-MM-DD.md` depuis le template semaine :
   - Pourquoi / intention / apport / suite · Fondements 1–3 refs
   - **Pattern** + **Warm-up** sur chaque jour actif (ids validés)
   - Hors pattern → `history/decisions.md`
   - Maintien du code meso respecté
   - Lun–Ven ≤90 min ; Mercredi team ou Z2 ; Samedi optionnel ; Dim off/Z2
   - Tableau **Notes / feedback**
3. Mettre à jour l’index du meso si besoin.
4. Mettre à jour [`.vitepress/current.json`](.vitepress/current.json).
5. Entrée `history/decisions.md` si arbitrage.
6. **Obligatoire** : `npm run lint:prog` — corriger toute ERROR avant de conclure.
