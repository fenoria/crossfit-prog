---
name: session-feedback
description: Ingère le feedback post-séance, met à jour profile / prog, adapte la suite comme un coach. Use when the athlete reports RPE, pain, loads done, missed reps, or schedule changes after a session.
---

# Session feedback

1. Lire `athletes/current.yaml` → profil `athletes/<id>/profile.yaml`.
2. Parser le feedback (idéal = blocs **Notes / feedback** de la semaine dans `prog/`, un jour = un `###`) :
   - fait / partiel / skip
   - charges / score
   - RPE
   - fatigue 1–5
   - note / variante / douleur **si mentionnée**
3. **Ne pas** demander systématiquement un score douleur. Si douleur signalée → protocole du profil (ex. `knowledge/adductor-protocol.yaml`) / adapter volume.
4. Si team WOD RPE ≥ seuil profil (`coaching.team_wod_rpe_threshold_cut_next_day`, défaut 8) → −volume J+1 (déjà dans maintenance-doses).
5. Adapter la suite **sans casser l’intention du meso** (couper volume, pas le focus).
6. Écrire dans le bloc du jour + **Synthèse semaine** / **Suite prévue**.
7. **Ne jamais** modifier le contenu prescrit des séances d’une semaine commencée ou passée (mise en forme OK ; Notes / feedback OK). Adapter **uniquement** la suite.
8. Si récurrent/durable → profil athlète actif (`athletes/<id>/profile.yaml`) (+ rule si process).
9. Si fin de meso : vérifier `knowledge/meso-gates.yaml` avant d’annoncer le suivant.
10. Confirmer brièvement ce qui change et pourquoi.
