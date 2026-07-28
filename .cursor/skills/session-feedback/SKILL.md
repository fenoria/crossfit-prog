---
name: session-feedback
description: Ingère le feedback post-séance, met à jour history/profile, adapte la suite comme un coach. Use when the athlete reports RPE, pain, loads done, missed reps, or schedule changes after a session.
---

# Session feedback

1. Parser le feedback (idéal = blocs **Notes / feedback** de la semaine dans `prog/`, un jour = un `###`) :
   - fait / partiel / skip
   - charges / score
   - RPE
   - adducteur 0–10
   - fatigue 1–5
   - note / variante
2. Appliquer `knowledge/adductor-protocol.yaml` si douleur > 2.
3. Si team WOD RPE ≥ 8 → −volume J+1 (déjà dans maintenance-doses).
4. Adapter la suite **sans casser l’intention du meso** (couper volume, pas le focus).
5. Écrire dans le bloc du jour + **Synthèse semaine** / **Suite prévue**.
6. Si récurrent/durable → `athlete/profile.yaml` + `history/decisions.md`.
7. Si fin de meso : vérifier `knowledge/meso-gates.yaml` avant d’annoncer le suivant.
8. Confirmer brièvement ce qui change et pourquoi.
