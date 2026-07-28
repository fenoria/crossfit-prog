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
4. Matrice conditioning sans Jamieson (`conditioning-matrix.yaml`)
5. Protocole adducteur gradué (`adductor-protocol.yaml`)
6. Warm-ups réutilisables (`warmups.yaml`)
7. Structure volumes MEV/MAV/MRV + champs `athlete/profile.yaml` (chiffres après S01)
8. Template meso + semaine enrichie (Pattern, Warm-up, feedback tableau)
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
