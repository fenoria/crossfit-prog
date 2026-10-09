---
paths:
  - "athletes/**/*"
---

# Profil athlète

**Résolution** : `athletes/current.yaml` (`id`) → `athletes/<id>/profile.yaml`.

## Profil vs journal
- `profile.yaml` = **état courant** : charges, volumes, crans, planning, contraintes, ancres.
- `athletes/<id>/journal/SXX-YYYY-MM-DD.yaml` = **historique** semaine par semaine (schéma : `knowledge/journal-schema.yaml`).
- `athletes/<id>/history.yaml` = palmarès, estimations anciennes, plans remplacés — **hors lecture par défaut**.
- `athletes/<id>/seasons/<saison>.yaml` = profil gelé en fin de saison (copie de `profile.yaml`, jamais modifié) — **hors lecture par défaut** ; le profil actif continue d'être le point de départ de la saison suivante, sans duplication.
- Ne pas remettre de bloc `sXX_results`, de récit de semaines passées ni de calendrier dans le profil : une semaine se distille dans le journal, le calendrier vit dans `knowledge/instances/<saison>.yaml`.

## Champs clés
- Capacités : `level`, `priorities`, `strengths`, `weaknesses_or_limits`, `gym_ladder_level`
- Planning : jours, horaires, `max_minutes`, team day, samedi (fréquence, créneau, durée), dimanche (off vs Z2), `active_recovery_over_rest`
- Matériel : setting box, machines guidées
- Blessure : `injury`, `programming_rules`, protocoles référencés
- Charges : `prs_current_kg`, `volumes.*` — jamais `prs_pre_injury_kg` pour les %
- Conditioning : `aerobic_anchors` (FC, allures, splits) — `null` autorisé, la matrice retombe alors sur le RPE
- Coaching : `coaching.*` (seuil team WOD, etc.)

## Mise à jour
- Chaque feedback → entrée de journal (créée avec la semaine, complétée au fil de l'eau).
- Les champs structurés du journal (`series`, `signaux`) nourrissent le dashboard `prog/saison-*/analytics.md` : ne pas les laisser vides après un feedback.
- Feedback **récurrent ou durable** (douleur à X kg, plafond charge, contrainte planning, cran gym franchi, ancre aérobie testée) → profil immédiatement, pas seulement dans le chat ni seulement dans le journal.
- Ne jamais inventer un chiffre absent du feedback : `null` + note.
