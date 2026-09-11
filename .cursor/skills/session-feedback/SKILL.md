---
name: session-feedback
description: Ingère le feedback post-séance, met à jour profile / prog, adapte la suite comme un coach. Use when the athlete reports RPE, pain, loads done, missed reps, or schedule changes after a session.
---

# Session feedback

Règles : **`.cursor/rules/prog-writing.mdc`** (immutabilité, Notes) · **`.cursor/rules/athlete-profile.mdc`** (profil).

1. Lire `athletes/current.yaml` → profil.
2. Parser feedback (blocs **Notes / feedback**, un `###` par jour) : fait · charges / score · note ; RPE par mouvement souvent inline dans charges ; RPE séance explicite le mercredi team ; fatigue / douleur dans note si mentionnées.
3. Pas de score douleur systématique. Si douleur → protocole profil / adapter volume.
4. Team WOD RPE ≥ seuil profil (défaut 8) → −volume J+1.
5. Adapter la suite sans casser l’intention du meso ; écrire bloc jour + **Synthèse semaine** / **Suite prévue**.
6. Semaine commencée/passée : Notes OK, contenu prescrit figé — adapter uniquement la suite.
7. **Journal** : reporter la semaine dans `athletes/<id>/journal/SXX-YYYY-MM-DD.yaml` (schéma `knowledge/journal-schema.yaml`) — jours, `realise` (doses effectives), `flags`, `ecarts_prescrit_vs_realise`, `gate`, synthèse. Chiffre absent du feedback → `null` + note, jamais d’estimation inventée.
8. **Écart prescrit / réalisé** : si le même mouvement sort deux semaines de suite dans le même sens (ex. barre systématiquement au-dessus du prescrit), la prescription est fausse — ré-ancrer les fourchettes dans le profil (`volumes.oly.load_anchoring`, `prs_current_kg`) et le signaler.
9. Récurrent/durable → profil (+ rule si process).
10. Fin de meso : vérifier `knowledge/meso-gates.yaml` avant meso suivant.
11. `npm run lint:prog` (inclut l’audit doses / boucle de feedback) puis confirmer brièvement ce qui change et pourquoi.
