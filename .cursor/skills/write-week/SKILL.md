---
name: write-week
description: Écrit ou met à jour une semaine d’entraînement en Markdown sous prog/ (Saison→Macro→Meso→Semaine). Use when creating a training week, mesocycle, macrocycle, or updating the program site content.
---

# Write week (prog/)

Règles rédaction : **`.cursor/rules/prog-writing.mdc`** (ton, ops pack, immutabilité, lint).

## Preconditions
- `knowledge/methodology.md` status **validated**
- Lire `athletes/current.yaml` → profil + dernières semaines du même meso
- Fiches livres + `knowledge/arbitrages.md` pertinentes
- Ops pack (agent only — ne pas coller ces chemins dans le texte visible) :
  - `knowledge/maintenance-doses.yaml` (`REAL-mini` → `REAL`)
  - `knowledge/session-patterns.yaml`
  - `knowledge/warmups.yaml` → recopier steps sous **Échauffement**
  - `knowledge/gym-ladder.md` si ACC-GYM
  - `knowledge/meso-gates.yaml` si changement de meso
  - `knowledge/conditioning-matrix.yaml`
  - protocole douleur du profil seulement si douleur signalée

## Templates
- Semaine : `prog/_templates/semaine.md`
- Meso (si nouveau) : `prog/_templates/meso.md`

## Steps
1. Assurer `index.md` Saison / Macro / Meso (`meso-NN-<slug>/`, `macrocycle-NN-<slug>/`).
2. Créer/mettre à jour `Sxx-YYYY-MM-DD.md` :
   - Pourquoi / intention / apport / suite · Fondements 1–3 refs
   - `<!-- pattern: -->` + `<!-- warmup: -->` ; échauffement détaillé ; séance numérotée
   - Maintien code meso en français ; `schedule` / team / Z2 / samedi selon profil
   - Notes feedback (`###` par jour)
3. Index meso + `.vitepress/current.json` si besoin.
4. Arbitrage durable → profil ou `knowledge/arbitrages.md`.
5. **Obligatoire** : `npm run lint:prog` — zéro ERROR.
