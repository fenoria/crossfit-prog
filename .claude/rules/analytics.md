---
paths:
  - "prog/analytics/**"
  - ".vitepress/theme/analytics/**"
  - ".vitepress/theme/analytics.css"
  - ".vitepress/theme/components/An*.vue"
  - "scripts/build-analytics.py"
---

# Dashboard analytics (`prog/analytics/`)

Une seule page (`prog/analytics/index.md`) : tuiles, frise de saison, charges, dose hebdo, signaux, crans gym. Thème SynthWave (tokens `--sw-*` dans `custom.css`).

## Flux de données
`athletes/<id>/journal/S*.yaml` + `profile.yaml` + `knowledge/instances/saison-*.yaml` + doses des semaines `prog/` → `scripts/build-analytics.py` (`npm run build:analytics`) → `.vitepress/theme/analytics/data.json` (commité, régénéré aussi par la CI) → composants `An*.vue`.
- Rien n'est écrit à la main dans les composants : un libellé, un repère ou un chiffre vient des données. Champ absent ou `null` = point absent du graphe, jamais un zéro.
- Pas de texte explicatif sur la page : le dashboard se lit par les légendes (pastilles) et les info-bulles.

## Journal → dashboard
Champs lus : `series` (charges), `signaux` (épaule / adducteur / mains, 0–3), `crans` (échelle gym, seulement quand un cran change), `realise.*` (doses), `phase_micro`, `statut`. Contrat : `knowledge/journal-schema.yaml`. Le cran courant du journal doit rester égal à `gym_ladder_level` du profil (le builder alerte sinon).

## e1RM (page Charges)
- Force estimée = charge / %1RM(reps + reps en réserve), table RPE→%1RM de Tuchscherer (`RM_TABLE`), `reps` lu dans `serie`, RPE = 10 − reps en réserve. Sans RPE ou sans `serie` : point non estimable, donc non tracé.
- Traction lestée : le % s'applique à (poids de corps du profil + lest), puis e1RM ramené en lest.
- `pause: true` (ex. front squat pause 2 s) : e1RM × `PAUSE_FACTOR` (1,07), marqué d'un losange.
- Les valeurs `comble` du journal (RPE / séries reconstitués depuis la prescription, S02–S10) sont traitées comme réelles : trace d'audit seulement.
- Un mouvement n'est affiché qu'avec au moins 3 semaines de données. Un point = le meilleur e1RM de la semaine.

## Tuiles
Macro en cours (% écoulé au jour près, fenêtre de l'instance de saison), jours avant l'Open, tonnage de la semaine (séries clés, une par mouvement ; la traction ne compte que le lest), minutes Z2 de la semaine (total `realise.z2_min`, à défaut somme des jours chiffrés). Les semaines en cours sont partielles.

## Ajouter une métrique ou une zone
1. Champ structuré dans le journal + `knowledge/journal-schema.yaml` + consigne dans le skill `session-feedback` (sans cette consigne, il restera vide).
2. Calcul dans `build-analytics.py`, jamais dans le composant.
3. Graphe SVG à l'échelle 1:1 : mesurer la largeur avec `useChartWidth` et espacer les étiquettes de semaines (la saison fera 52 semaines). Info-bulle via `useTip` (survol et tap), classe `an-hit` sur les zones interactives.
4. Vérifier desktop et mobile (375 px), puis `npm run docs:build`.
