---
name: run-benchmarks
description: Propose et enregistre une batterie de benchmarks pour calibrer les charges et mesurer la progression. Use when planning test days, retesting PRs, or updating current loads in athlete/profile.yaml.
---

# Run benchmarks

1. Si un meso benchmarks / semaine existe déjà dans `prog/` → **adapter ce fichier**, ne pas recréer une batterie divergente.
2. Batterie : force, Oly contrôlé, gym volume, ergo smoke test — **pas** de max out squat snatch/clean agressifs.
3. Respecter créneaux 90 min ; charges actuelles (pas PRs pré-blessure).
4. Après résultats :
   - `athlete/profile.yaml` → `prs_current_kg` + `benchmarks.last_run`
   - `gym_ladder_level` (`knowledge/gym-ladder.md`)
   - `volumes.*` MEV de départ (instance) ; bornes dans `volume-landmarks.yaml`
5. Vérifier gate `benchmarks_to_ACC_GYM` (`knowledge/meso-gates.yaml`).
6. Noter dans `history/decisions.md` et expliquer le recalibrage des %.
