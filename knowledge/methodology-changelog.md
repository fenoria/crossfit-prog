# Méthodologie — journal de validation

> Historique des validations et des versions de `methodology.md`. **Hors lecture par défaut** : le statut qui fait foi est dans l’en-tête de `methodology.md` et dans `methodology.yaml`.

## Ce que la v2 a changé (2026-09-11)

> **Ce que la v2 change.** La v1 décrivait bien *quoi* faire. Elle ne vérifiait rien, ne mesurait presque rien, ne partait pas de la compétition, et traitait une blessure ancienne comme une contrainte définitive. La v2 ajoute quatre choses : les doses écrites sont **auditées**, les qualités clés sont **mesurées à protocole figé**, la préparation part des **exigences de l’épreuve**, et une contrainte ancienne se **recharge progressivement** au lieu de se contourner indéfiniment. Rien du socle v1 n’est retiré.

## Validation v2.1 (2026-10-03, athlète)
- [x] 9.1 Placement force / conditioning
- [x] 9.2 Force max entretenue, force-endurance à 70–80 %
- [x] 9.3 Répétabilité gym orientée régularité et pauses (+ découpage tenu noté)
- [x] 9.4 Test de saut T4 (CMJ filmé par application) — **retiré le 2026-10-05** (matériel et application payante indisponibles)
- [ ] 9.5 Mouvements faibles chronométrés une fois par meso — **écarté**

## Ajustement 2026-10-08 (athlète)
- [x] 1 format court individuel / sem. en plus du team en TRA-POW et ACC-GYM, gym acquise uniquement, plafond 3 efforts durs (arbitrages §27)

---

## Validation méthodo de base

- [x] Issurin blocs concentrés
- [x] GYM prioritaire en Macro 1 Build
- [x] Power Oly > squat Oly lourd (phase actuelle)
- [x] Conditioning en maintien
- [x] Microcycles volume → surcharge → pic → deload

## Validation architecture annuelle

- [x] Année en **2–3 macrocycles** (Bompa multi-pic) + transition — pas un seul run FORCE→GYM→HALTÉRO→SPEC façon BON
- [x] Chaque macro = stages **Accumulation → Transmutation → Realization** (Issurin)
- [x] Mesos nommés par **intention** (ACC-GYM, ACC-STR, TRA-MIX, REAL…) et **répétés** dans l’année
- [x] Macro 1 août–sept. 2026 : Benchmarks → ACC-GYM → REAL (Fire B) → TRANS ; ACC-STR → TRA-POW → TRA-MIX en Macro 2 → ACC-GYM en Macro 3, vers l'Open 2027

## Validation ops pack (2026-07-28)

- [x] Maintien / gates / ladder / patterns / warmups / conditioning matrix (+ protocole douleur on-demand)
- [x] Templates meso + semaine (feedback structuré)
- [x] Patch cohérence 2026-07-28 (canon REAL, SoT, lint, Z2/volumes)
- [x] Volumes MEV/MAV/MRV gym/force/oly chiffrés — faits dans le profil ; `volume-landmarks.yaml` rétrogradé au rang de référence

## Validation v2 (2026-09-11, athlète : oui sur l’ensemble)

- [x] **Doses auditées** : chaque semaine déclare ses volumes, `npm run lint:prog` les vérifie (profil, doses de maintien, caps conditioning, boucle de feedback, écart prescrit/réalisé)
- [x] **Journal** : le profil devient l’état courant, l’historique passe dans `athletes/<id>/journal/`
- [x] **Réathlétisation** : paliers adducteur deux fois par semaine **à partir du 21 septembre**, prehab épaule sur les jours gym, critère chiffré de relèvement du plafond de squat
- [x] **Ancres aérobies** : relevé lors de la sortie longue du 10 octobre, puis prescription cardio par FC et allure
- [x] **Tests signature** : trois protocoles figés rejoués à chaque macrocycle
- [x] **Compétition** : exigences → trous → actions, affûtage chiffré, trame de journée
- [x] **Séparation générique / instance / profil / journal**
- [x] **Maintien gym à deux expositions par semaine pendant un bloc force** (touch court le mardi, séance le jeudi, ~8 min ajoutées à deux séances) — accepté

Validée le 2026-07-27 (athlète). Ops pack 2026-07-28. Calendrier B/C ancré 2026-07-29. **v2 rédigée et revalidée le 2026-09-11.** Prochaine revue : à la porte de sortie du bloc force (relevé du 10 octobre et tests signature de S10).
