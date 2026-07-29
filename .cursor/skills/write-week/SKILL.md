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
- Relire ops pack (agent only — ne pas coller ces chemins dans le texte visible) :
  - `knowledge/maintenance-doses.yaml` (code meso ; `REAL-mini` → `REAL`)
  - `knowledge/session-patterns.yaml`
  - `knowledge/warmups.yaml` → **recopier les steps** sous **Échauffement**
  - `knowledge/gym-ladder.md` si ACC-GYM
  - `knowledge/meso-gates.yaml` si changement de meso (scope Macro 1)
  - `knowledge/conditioning-matrix.yaml`
  - `knowledge/adductor-protocol.yaml` seulement si douleur signalée (pas de focus systématique)
- Samedi : optionnel (décider selon dispo)

## Langage athlète (obligatoire)
- Texte visible = compréhensible à l’entraînement **et partageable** (collègue / coach sans questions).
- **Ton neutre** : pas de tutoiement (« tu / toi / Si tu… ») — « Si entraînement », « Si séance », « ici », « la prog », « on ».
- **Objectif de la semaine** en tête (pas créneau / matériel / profil athlète).
- Échauffement **écrit en entier** ; cibles **chiffrées** (reps / RPE / durée / repos).
- Pas de `knowledge/…`, `athlete/…`, codes meso bruts seuls, ids `warmup_*` visibles.
- Ids ops en commentaires HTML : `<!-- pattern: … -->` · `<!-- warmup: … -->`
- Formuler la suite en « Suite prévue : … » (pas « Décision J+7 »).

## Immutabilité (semaine commencée / passée)
- **Ne jamais** modifier le contenu prescrit des séances d’une semaine déjà commencée ou passée.
- Mise en forme OK (sans changer le sens) ; blocs Notes / feedback OK.
- Toute adaptation → semaine(s) suivante(s) uniquement + `history/decisions.md` si durable.

## Steps
1. Assurer les `index.md` Saison / Macro / Meso (meso depuis template meso).
2. Créer/mettre à jour `Sxx-YYYY-MM-DD.md` depuis le template semaine :
   - Pourquoi / intention / apport / suite · Fondements 1–3 refs (auteur + titre)
   - Commentaires pattern + warmup sur chaque jour actif
   - **Échauffement** détaillé + **Séance** numérotée
   - Hors pattern → `history/decisions.md`
   - Maintien du code meso respecté (formulé en français)
   - Lun–Ven ≤90 min ; Mercredi team ou Z2 ; Samedi optionnel ; Dim off/Z2
   - Blocs **Notes / feedback** (un `###` par jour, pas de tableau)
3. Mettre à jour l’index du meso si besoin.
4. Mettre à jour [`.vitepress/current.json`](.vitepress/current.json).
5. Entrée `history/decisions.md` si arbitrage.
6. **Obligatoire** : `npm run lint:prog` — corriger toute ERROR avant de conclure.
