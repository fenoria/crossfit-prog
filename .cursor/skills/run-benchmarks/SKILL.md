---
name: run-benchmarks
description: Propose et enregistre une batterie de benchmarks pour calibrer les charges et mesurer la progression. Use when planning test days, retesting PRs, or updating current loads in athlete/profile.yaml.
---

# Run benchmarks

1. Proposer une batterie adaptée (force, Oly contrôlé, gym volume, ergos) — **pas** de max out squat snatch/clean agressifs.
2. Respecter adducteur et créneaux 90 min (étaler sur plusieurs jours si besoin).
3. Après résultats :
   - `athlete/profile.yaml` → `prs_current_kg` + `benchmarks.last_run`
   - `gym_ladder_level` (crans baseline, `knowledge/gym-ladder.md`)
   - `volumes.*` MEV de départ (voir `knowledge/volume-landmarks.yaml`) — démarrer bas
4. Vérifier gate `benchmarks_to_ACC_GYM` dans `knowledge/meso-gates.yaml`.
5. Noter dans `history/decisions.md` et expliquer comment ça recalibre les %.
