---
name: run-benchmarks
description: Propose et enregistre une batterie de benchmarks pour calibrer les charges et mesurer la progression. Use when planning test days, retesting PRs, or updating current loads in the active athlete profile.
---

# Run benchmarks

1. Lire `athletes/current.yaml` → profil `athletes/<id>/profile.yaml`.
2. Si un meso benchmarks / semaine existe déjà dans `prog/` → **adapter ce fichier**, ne pas recréer une batterie divergente.
3. Batterie : force, Oly, gym volume, ergo smoke test — doser selon `injury` / `programming_rules` / limites du profil (pas de max out agressifs si le profil l’interdit).
4. Respecter `schedule.max_minutes` du profil ; % sur `prs_current_kg` seulement (jamais `prs_pre_injury_kg` si présent).
5. Après résultats :
   - profil athlète actif → `prs_current_kg` + `benchmarks.last_run`
   - `gym_ladder_level` (`knowledge/gym-ladder.md`)
   - `volumes.*` MEV de départ (instance) ; bornes dans `volume-landmarks.yaml`
6. Vérifier gate `benchmarks_to_ACC_GYM` (`knowledge/meso-gates.yaml`).
7. Expliquer le recalibrage des % (charges actuelles = SoT).
