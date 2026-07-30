---
name: session-feedback
description: Ingère le feedback post-séance, met à jour profile / prog, adapte la suite comme un coach. Use when the athlete reports RPE, pain, loads done, missed reps, or schedule changes after a session.
---

# Session feedback

Règles : **`.cursor/rules/prog-writing.mdc`** (immutabilité, Notes) · **`.cursor/rules/athlete-profile.mdc`** (profil).

1. Lire `athletes/current.yaml` → profil.
2. Parser feedback (blocs **Notes / feedback**, un `###` par jour) : fait · charges · RPE · fatigue · note · douleur si mentionnée.
3. Pas de score douleur systématique. Si douleur → protocole profil / adapter volume.
4. Team WOD RPE ≥ seuil profil (défaut 8) → −volume J+1.
5. Adapter la suite sans casser l’intention du meso ; écrire bloc jour + **Synthèse semaine** / **Suite prévue**.
6. Semaine commencée/passée : Notes OK, contenu prescrit figé — adapter uniquement la suite.
7. Récurrent/durable → profil (+ rule si process).
8. Fin de meso : vérifier `knowledge/meso-gates.yaml` avant meso suivant.
9. Confirmer brièvement ce qui change et pourquoi.
