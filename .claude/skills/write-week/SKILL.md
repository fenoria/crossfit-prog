---
name: write-week
description: Écrit ou met à jour une semaine d’entraînement en Markdown sous prog/ (Saison→Macro→Meso→Semaine). À utiliser pour créer une semaine, un mésocycle ou un macrocycle, ou mettre à jour le contenu du site programme.
---

# Write week (prog/)

Règles rédaction : **`.claude/rules/prog-writing.md`** (ton, ops pack, immutabilité, lint).

## Preconditions
- `knowledge/methodology.yaml` status **validated** (ne pas relire `methodology.md` en entier : seulement la section du meso concerné si besoin)
- Ne pas coller les chemins `knowledge/` / `athletes/` dans le texte visible

## Lecture ciblée (dans cet ordre, rien de plus sans raison)
1. `athletes/current.yaml` → profil (état courant, prioritaire sur tout chiffre).
2. `knowledge/instances/<saison>.yaml` → semaine, meso, points de mesure, samedis utiles, paliers de réathlétisation.
3. **Journal** des 2 dernières semaines (`athletes/<id>/journal/`) → réalisé, écarts, flags, `suite`. C'est le résumé du passé : pas besoin de relire les semaines `prog/` complètes.
4. **Semaine précédente** dans `prog/` en entier (continuité de forme, charges d'approche, progression).
5. Semaines S-2 et S-3 : `grep` des balises `<!-- pattern|dose|meso -->` et des titres de jours seulement (rotation des accessoires, variété).
6. Ops pack, uniquement les entrées du meso en cours :
   - `knowledge/maintenance-doses.yaml` (`REAL-mini` → `REAL`)
   - `knowledge/session-patterns.yaml` (ids + `accessory_rotation` : lifts stables, banque accessoires **nouvelle par meso**)
   - `knowledge/warmups.yaml` → **Préparation spécifique** chiffrée pour la séance (pas d'échauffement générique) · **Prehab épaule** dans la séance si `warmup_shoulder_care`
   - `knowledge/conditioning-matrix.yaml`
   - `knowledge/movement-coverage.yaml` (familles de mouvements → `mixed=` dans la balise dose)
   - `knowledge/gym-ladder.md` si ACC-GYM · `knowledge/meso-gates.yaml` si changement de meso
   - `knowledge/reathletisation.md` pour le palier en cours · protocole douleur du profil seulement si douleur signalée
7. `knowledge/arbitrages.md` (décisions en vigueur, fichier court) · une fiche `knowledge/books/` seulement pour les refs corpus citées.

## Templates
- Semaine : `prog/_templates/semaine.md`
- Meso (si nouveau) : `prog/_templates/meso.md`

## Steps
1. Assurer `index.md` Saison / Macro / Meso (`meso-NN-<slug>/`, `macrocycle-NN-<slug>/`).
2. Créer/mettre à jour `Sxx-YYYY-MM-DD.md` :
   - Pourquoi / intention / apport / suite · 1–3 refs corpus intégrées (auteur entre parenthèses)
   - `<!-- pattern: -->` + `<!-- warmup: -->` ; préparation spécifique chiffrée ; séance numérotée
   - **Liens timer** sur chaque bloc chronométré paramétrable (voir `prog-writing.md` → Liens timer)
   - Maintien code meso en français ; `schedule` / team / Z2 / samedi selon profil + instance
   - Pas de bloc feedback : ce qu'il faut relever s'écrit dans la séance (« noter … » sur la ligne) ; la section `## Bilan` s'ajoute au feedback (skill `session-feedback`)
3. Créer l’entrée de journal (`statut: planifiee`) avec `reperes` (relevés attendus de la semaine, à `null`, format en commentaire), `series: []` et `signaux` à niveau 0 (voir `knowledge/journal-schema.yaml` v3) et `a_verifier` (questions à trancher au bilan) · index meso si besoin (« En cours » = auto par date).
4. Arbitrage durable → profil ou `knowledge/arbitrages.md`.
5. **Obligatoire** : `npm run lint:prog` — zéro ERROR.
