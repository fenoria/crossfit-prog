# Décisions coach

## 2026-07-27 — Validation méthodo

1. Blocs Issurin · 2. GYM prioritaire reconstruction · 3. Power Oly · 4. Conditioning maintien · 5. Micro volume→surcharge→pic→deload

## 2026-07-27 — Architecture annuelle

Bompa 2–3 macrocycles + Issurin Acc→Trans→Real.  
Macro 1 : Benchmarks → ACC-GYM → ACC-STR → TRA-MIX → REAL (mini) → TRANS.

## 2026-07-27 — Hiérarchie nommage

Saison → Macrocycle → Meso → Semaine (1 fichier/semaine) — validée.

## 2026-07-27 — Abandon Notion → Markdown + VitePress

- Source de vérité : **`prog/`**
- Site : **VitePress** (Vue)
- Sidebar **auto** depuis l’arbo `prog/`
- Semaine en cours : `.vitepress/current.json`
- Ingest livres : `npm run ingest` → `scripts/ingest-books.py`

## 2026-07-28 — Ops pack cohérence (pré-benchmarks)

Tout ce qui était faisable **sans** résultats S01 :

1. Doses de maintien par type de meso (`maintenance-doses.yaml`)
2. Gates de sortie de meso (`meso-gates.yaml`, scope Macro 1)
3. Ladder gym Low→CF (`gym-ladder.md`)
4. Matrice conditioning Laursen & Buchheit (`conditioning-matrix.yaml`) — Bible PP en socle FR
5. Protocole adducteur gradué (`adductor-protocol.yaml`)
6. Warm-ups réutilisables (`warmups.yaml`)
7. Structure volumes MEV/MAV/MRV + champs `athlete/profile.yaml` (chiffres après S01)
8. Template meso + semaine enrichie (Pattern, Warm-up, feedback structuré)
9. Rule team RPE≥8
10. Skills/rules ops + lint `npm run lint:prog`

**Reporté post-S01** : remplir `prs_current_kg`, `volumes.*`, `gym_ladder_level`, valider `volume-landmarks.yaml`.

## 2026-07-28 — Patch cohérence revue finale

- Canon code meso `REAL` (alias label « REAL mini »)
- Arbitrages en-tête : validé (plus « À valider »)
- Z2 : MEV 60 Acc ; sous-MEV OK en REAL (fraîcheur)
- Volumes : profile = instance ; landmarks = bornes
- SoT couches clarifiées (rules knowledge vs prog)
- Lint durci (patterns multiples, warmups, Pattern obligatoire)
- S01 / template : Warm-up Mer–Dim ; smoke test 500 m explicite
- Gates Macro 1 only documenté ; exception Bompa GYM-first
- Rule élite allégée → pointeurs vers profile

## 2026-07-28 — Feedback semaine : blocs, pas tableau

Tableau 7 colonnes illisible (surtout mobile / VitePress).  
Format = un `###` par jour avec listes : Fait · Charges/score · RPE · Fatigue · Note.  
Template + S01 + skills/rules/profile alignés.

## 2026-07-28 — Adducteur : contrainte de fond, pas focus quotidien

Blessure ~2025, douleur résiduelle possible → charges contrôlées / pas PRs pré-blessure.  
**Pas** de score adducteur obligatoire en feedback ni de rappels systématiques dans `prog/`.  
L’athlète signale s’il a mal ; le coach applique alors `adductor-protocol.yaml`.

## 2026-07-28 — Fiches livres sur le site

Fiches de lecture athlète sous `prog/livres/` (sidebar auto + nav « Livres »).  
SoT coach enrichi en parallèle dans `knowledge/books/` (mêmes slugs).  
Objectif : comprendre la méthodo sans lire les 12 ouvrages en entier.

## 2026-07-28 — Calendrier compétitions (ancre annuelle)

Pour caler les cycles en général :

1. **A** — *Battle of Normandy Throwdown* : **2ème weekend de juillet** (grosse compete)
2. **B** — *Fire Contest* (Nantes) : **2ème weekend de septembre** (plus petite) — **team mixte à 2**
3. **C** — *S7mbioz Throwdown* (équipe) : **12–13 décembre 2026** (confirmé)
4. **Opportunistes** — petites compet possibles dans l’année, dates non définies → intégrer seulement quand annoncées, sans casser le plan A/B/C

Conséquence prog : macros / pics / taper autour de juillet (A) → septembre (B) → décembre (C team).  
**2026** : A faite → prochaine = Fire Contest (~12–13 sept.) puis S7mbioz (12–13 déc.).  
Profil : `athlete/profile.yaml` → `goal.competitions` + `goal.results`.

### Résultat Battle 2026

*Battle of Normandy Throwdown* — **7e / 40** division **RX**, team de **3**.  
Niveau élite confirmé en contexte compétition ; pas de changement de priorité méthodo (GYM volume + confiance barre contrôlée). Benchmarks S01 (août) restent la calibration charges post-compete.

### Résultat Fire 2025

*Fire Contest* (Nantes) — **5e / 40** division **RX**, team mixte à **2**.  
Référence pour caler Fire 2026 (même format).

## 2026-07-29 — Conditioning : Laursen & Buchheit remplace le gap energy systems

Ajout corpus : *Science and Application of High-Intensity Interval Training* (Laursen & Buchheit).  
- **Pilote** conditioning / HIIT (cibles physiologiques + formats).
- Bible PP reste socle FR / variété.
- Matrice `conditioning-matrix.yaml` v2 ; arbitrages §6 mis à jour.
- Plus de gap conditioning ouvert dans `methodology.yaml`.

## 2026-07-28 — Immutabilité des semaines commencées / passées

Une fois une semaine **commencée** ou **dépassée** :
- **Pas** de changement rétroactif du **contenu** des séances (vérité historique de ce qui était prescrit / fait).
- Mise en forme OK si besoin (sans changer le sens).
- Notes / feedback OK (journal de ce qui a été fait).
- Adaptations → semaines futures uniquement.

Rules / skills : `prog-markdown-source.mdc`, `write-week`, `session-feedback`.

## 2026-07-29 — Ton neutre dans `prog/`

Pas d’adresse directe / tutoiement dans le texte visible (`tu`, `toi`, `chez toi`, `pour toi`, `Si tu…`).  
Formulations type : « Si entraînement », « Si séance », « ici », « la prog », « on ».  
Appliqué aux semaines, macros, fiches livres ; rules `french-domain`, `prog-markdown-source`, `ops-coherence` + skill `write-week`.
