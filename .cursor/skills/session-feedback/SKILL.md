---
name: session-feedback
description: Ingère le feedback post-séance, met à jour profile / prog, adapte la suite comme un coach. Use when the athlete reports RPE, pain, loads done, missed reps, or schedule changes after a session.
---

# Session feedback

1. Parser le feedback (idéal = blocs **Notes / feedback** de la semaine dans `prog/`, un jour = un `###`) :
   - fait / partiel / skip
   - charges / score
   - RPE
   - fatigue 1–5
   - note / variante / douleur **si mentionnée**
2. **Ne pas** demander systématiquement un score adducteur. Si douleur signalée (adducteur ou autre) → appliquer `knowledge/adductor-protocol.yaml` / adapter volume.
3. Si team WOD RPE ≥ 8 → −volume J+1 (déjà dans maintenance-doses).
4. Adapter la suite **sans casser l’intention du meso** (couper volume, pas le focus).
5. Écrire dans le bloc du jour + **Synthèse semaine** / **Suite prévue**.
6. **Ne jamais** modifier le contenu prescrit des séances d’une semaine commencée ou passée (mise en forme OK ; Notes / feedback OK). Adapter **uniquement** la suite.
7. Si récurrent/durable → `athlete/profile.yaml` (+ rule si process).
8. Si fin de meso : vérifier `knowledge/meso-gates.yaml` avant d’annoncer le suivant.
9. Confirmer brièvement ce qui change et pourquoi.
