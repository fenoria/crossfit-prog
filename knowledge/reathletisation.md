# Réathlétisation — adducteur et épaule

**Statut** : `validated` (athlète, 2026-09-11) · démarrage palier 1 le 2026-09-21
**Pilotes** : Verkhoshansky (charge progressive orientée transfert) · Low (progression par paliers propres) · Israetel (dose, montée par petits incréments) · Bible PP (renforcement excentrique et isométrique)

> Ce document est un **plan de charge**, pas un avis médical. Douleur nette, persistante ou en aggravation → avis professionnel, et `adductor-protocol.yaml` pour la conduite en séance.

---

## Pourquoi ce document existe

Jusqu'ici, l'adducteur était traité par **évitement** : plafond de squat à 115 kg, pas de squat clean ni snatch lourds, pas de Copenhagen chargé, protocole activé seulement si l'athlète signale une douleur. C'est correct en phase aiguë ; un an après la désinsertion, ça devient un plafond permanent.

Les faits : charge de travail de squat bornée à 115 kg alors que le 3RM de test est à 130, tension (pas douleur) ressentie dès ~120 kg, PR pré-blessure à 160. L'écart n'est pas de la force manquante, c'est un tissu qui n'a jamais été rechargé progressivement dans son amplitude et sa direction de travail.

Même logique pour l'épaule : gêne légère signalée en S05 sur les mouvements de poussée, aucun protocole associé, et le volume de kipping en appui renversé monte de S08 à S15. Une gêne connue plus une rampe de volume sans travail de tolérance, c'est le scénario type d'une blessure évitable.

**Principe retenu** : la charge est le traitement, à condition d'être progressive, indolore et mesurée. On ne supprime pas les garde-fous, on leur ajoute une sortie.

---

## Piste adducteur

**Dose** : 2 fois par semaine, 5 à 8 min, adossées aux séances lower et à la séance gym. Cette dose ne vole pas le budget du lift du jour — elle remplace un accessoire de gainage latéral (même famille).

**Règle de douleur** : tout se fait à douleur 0–2 sur 10. Une douleur ≥ 3 pendant ou après → retour au palier précédent et `adductor-protocol.yaml`. Une tension d'étirement en fin d'amplitude n'est pas une douleur.

| Palier | Contenu | Dose de départ | Passage au palier suivant si… |
|--------|---------|----------------|-------------------------------|
| **1 — Isométrie** | Adduction isométrique ballon ou poing entre les genoux, jambes fléchies puis tendues | 5 × 20 s, effort 50 % puis 70 % | 2 semaines sans douleur, effort 70 % tenu sans appréhension |
| **2 — Copenhagen court** | Copenhagen genou fléchi (appui au genou, bras de levier court) | 3 × 6–8 par côté, tempo 2-1-2 | 2 semaines propres, aucune gêne le lendemain |
| **3 — Copenhagen long** | Copenhagen jambe tendue (appui à la cheville) | 3 × 6–8 par côté | Séries complètes sans casse de position, rien le lendemain |
| **4 — Amplitude chargée** | Fente latérale lestée légère, side lunge, slider adduction | 3 × 8 par côté, charge modérée | Amplitude complète confortable sous charge |
| **5 — Transfert** | Squat profond en montée de charge encadrée (ci-dessous), split squat tempo | — | Voir critère de plafond |

**Progression prévue (instance 2026)** : palier 1 sur S08–S09, palier 2 sur S10–S12, palier 3 sur S13–S15, paliers 4 et 5 pendant le Macrocycle 3 et la transition de décembre, où le volume de force est bas.

### Critère de relèvement du plafond de squat

Le plafond de 115 kg ne bouge pas au feeling. Il bouge quand **les trois conditions** sont réunies :

1. Palier 3 tenu pendant 2 semaines, sans douleur ni gêne le lendemain.
2. Une série de squat à 117,5 kg passe sans tension notable (pas seulement sans douleur).
3. La semaine en cours n'est ni une semaine de pic ni une semaine précédant une compétition.

Alors : **+2,5 kg maximum par palier**, une seule montée par bloc, et on reste au moins deux semaines à la nouvelle charge avant d'envisager la suivante. Une tension qui revient annule la montée sans discussion — on redescend de 2,5 kg et on reste là.

Objectif réaliste à horizon Macro 3 / transition : squat de travail à 120–125 kg. Pas 160. Le PR pré-blessure reste une référence historique, jamais une cible de séance.

### Ce qui reste interdit

- Squat snatch et squat clean lourds (règle profil inchangée).
- Montée de charge un jour de fatigue haute, de douleur signalée ou de retour de compétition.
- Rattraper deux semaines manquées en doublant la dose.

---

## Piste épaule

**Contexte** : gêne légère en poussée signalée en S05 (pompes sautées, muscle-ups sans problème), aucun signalement depuis. Le kipping en appui renversé est introduit à partir de S08 et monte jusqu'à S15.

**Dose** : 2 fois par semaine, 3 à 4 min, intégrées à l'échauffement des jours gym et upper (`warmup_shoulder_care`).

| Bloc | Contenu | Dose |
|------|---------|------|
| Rotateurs externes | Rotation externe élastique coude au corps, puis à 90° d'abduction | 2 × 12 par côté, charge légère |
| Serratus et scapula | Wall slides, serratus punch, scap push-up | 2 × 10 |
| Tolérance à la position | Suspension passive puis active, hollow hold en appui | 2 × 20–30 s |

**Règle de rampe kipping** : le volume de kipping n'augmente d'une semaine à l'autre que si les **deux dernières séances** se sont passées sans gêne. Une gêne signalée → on reste au volume précédent la semaine suivante. Deux gênes consécutives → retour au strict et le kipping sort du plan jusqu'à ce que la poussée soit confortable.

C'est déjà la logique de la ladder gym (un cran ne se franchit que propre) ; elle est ici explicitée pour l'épaule parce que le signal est plus discret qu'une casse technique.

---

## Suivi

- Chaque semaine : palier en cours noté dans le journal (`flags` si gêne).
- Chaque montée de plafond de squat : profil (`prs_current_kg`, commentaire de `volumes`) et arbitrage si la règle change.
- Rien de tout cela ne se demande à l'athlète séance par séance : on note ce qui est signalé, comme pour le reste.
