---
paths:
  - "prog/saison-*/analytics.md"
  - ".vitepress/theme/analytics/**"
  - ".vitepress/theme/analytics.css"
  - ".vitepress/theme/components/An*.vue"
  - "scripts/build-analytics.py"
---

# Dashboard analytics (`prog/saison-*/analytics.md`)

Une page par saison, dans le dossier de la saison (menu : entre « Vue d'ensemble » et le Macro 1). La page ne contient que les composants `<An… />` : ils lisent `data/<saison>.json` d'après le dossier de la page (`useSeasonData`), donc rien à modifier dans les composants pour une nouvelle saison.

## Flux de données
`athletes/<id>/journal/S*.yaml` + `profile.yaml` + `knowledge/instances/saison-*.yaml` + doses des semaines `prog/` → `scripts/build-analytics.py` (`npm run build:analytics [saison-2026]`) → `.vitepress/theme/analytics/data/<saison>.json` (commité, régénéré aussi par la CI) → composants `An*.vue`.
- Une saison est construite si son instance a `status: active` ou `archived` (une instance `draft` est ignorée).
- Les journaux sont attribués à une saison **par leur date** (fenêtre = début du 1er macrocycle → dernière semaine d'échéance) : la numérotation S01… peut donc repartir de zéro à la saison suivante.
- Phases et couleurs de la frise : une par macrocycle de l'instance, dans l'ordre ; libellé = clé `label` du macrocycle (sinon dérivé de sa clé).
- Rien n'est écrit à la main dans les composants : un libellé, un repère ou un chiffre vient des données. Champ absent ou `null` = point absent du graphe, jamais un zéro.
- Pas de texte explicatif sur la page : le dashboard se lit par les légendes (pastilles) et les info-bulles.

## Nouvelle saison
1. **Geler l'ancienne saison d'abord** : copier le profil actif vers `athletes/<id>/seasons/saison-YYYY.yaml` (`cp athletes/<id>/profile.yaml athletes/<id>/seasons/saison-AAAA.yaml`, AAAA = saison qui se termine), puis passer son instance en `status: archived`. Le profil actif n'est pas dupliqué : il reste le point de départ de la nouvelle saison.
2. `knowledge/instances/saison-YYYY.yaml` (`status: active`, macrocycles avec `label`, `semaines`, `fenetre`, `mesos`, `echeance_suivante`).
3. Dossier `prog/saison-YYYY/` avec `analytics.md` (copie de la page précédente : titre + composants).
4. `npm run build:analytics`, vérifier le menu et la page.
Une saison archivée se construit avec son profil gelé (volumes, poids de corps, références pré-blessure de l'époque) ; sans ce fichier, le builder alerte et retombe sur le profil courant.

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
