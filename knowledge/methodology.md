# Méthodologie CrossFit élite — v2

**Statut : `validated`** — v2 revalidée avec l’athlète le 2026-09-11  
Validée le : 2026-07-27 (athlète : oui sur structure Issurin, GYM d’abord, power Oly, conditioning maintien, microcycles volume→surcharge→pic→deload)  
Étendue le : 2026-09-11, **revalidée le même jour** — sept chantiers, détail et conflits d’auteurs dans `arbitrages.md` §16 à §19  
Sources : corpus `books/` (12 ouvrages) · profil athlète actif (`athletes/<id>/profile.yaml`) · arbitrages `knowledge/arbitrages.md`

> **Ce que la v2 change.** La v1 décrivait bien *quoi* faire. Elle ne vérifiait rien, ne mesurait presque rien, ne partait pas de la compétition, et traitait une blessure ancienne comme une contrainte définitive. La v2 ajoute quatre choses : les doses écrites sont **auditées**, les qualités clés sont **mesurées à protocole figé**, la préparation part des **exigences de l’épreuve**, et une contrainte ancienne se **recharge progressivement** au lieu de se contourner indéfiniment. Rien du socle v1 n’est retiré.

---

## 1. Philosophie

1. **Une intention dominante par meso** (Issurin) — pas « tout travailler tout le temps ».
2. **Dose intelligente** (Israetel) — progresser entre MEV et MRV ; deload avant de casser.
3. **Transfert vers la compétition** (Verkhoshansky) — la force et la gym doivent se retrouver sous fatigue CF.
4. **Comprendre pour adhérer** — chaque cycle / meso / semaine / séance a un pourquoi explicite.
5. **Santé > ego** — confiance barre et charges actuelles guident les variantes (power vs squat) ; douleur signalée → adapter.
6. **Z2 > off** si créneau possible ; vrai repos seulement si fatigue/douleur/deload/taper l’exigent.
7. **Une dose écrite est une dose vérifiée** — chaque semaine déclare ses volumes, un audit les confronte au profil et aux caps. Une borne qu’on n’ausculte jamais n’est pas une borne, c’est une intention.
8. **Mesurer ce qu’on prescrit** — trois tests figés rejoués chaque macro, des ancres physiologiques pour le cardio. Sans protocole répété à l’identique, « ça progresse » reste une impression.
9. **Partir de la demande, pas seulement des qualités** — à l’approche d’un pic, la question n’est plus « qu’est-ce qui est faible » mais « qu’est-ce que l’épreuve exige et que je n’ai jamais fait ».
10. **Recharger plutôt qu’éviter** — une blessure ancienne se réathlétise par paliers indolores ; sinon l’évitement devient un plafond permanent.
11. **Une information, une source** — le profil porte l’état courant, le journal l’historique, l’instance de saison le calendrier, `knowledge/` le générique.

**Règle d’or** : si la fatigue monte, on coupe le **volume**, pas l’intention du bloc.

---

## 2. Profil → implications

| Donnée | Implication prog |
|--------|------------------|
| Cardio / ergos / WB / burpees forts | Ne pas sur-investir le conditioning ; maintien |
| Faible volume gym | Meso(s) GYM prioritaires ; densité + renfo (Low) |
| Charges post-blessure (adducteur 2025) | Benchmarks d’abord ; charges actuelles only ; pas de focus quotidien douleur — **et** piste de recharge progressive (`reathletisation.md`) avec critère chiffré de relèvement du plafond de squat |
| Frileux squat snatch/clean lourds | Power / technique / pulls ; exposition profonde rare — manque assumé et écrit dans `competition-demands.yaml` |
| Gêne d’épaule signalée en poussée | Prehab rotateurs / serratus sur les jours gym ; le volume de kipping ne monte que si les deux dernières séances sont passées sans gêne |
| 90 min midi · samedi optionnel | Séances condensées ; samedi = volume « luxe » si dispo |
| Box only | Pas de machines guidées |

---

## 3. Architecture temporelle (années — livres, pas BON)

> **Correction** : l’ancienne prog BON (FORCE → GYM → HALTÉRO → SPÉCIFIQUE → pré-comp → taper) était un **unique pic** vers une compétition. Ce n’est **pas** le modèle annuel retenu. On s’aligne sur **Issurin** (stages / résidus) + **Bompa** (plan annuel multi-pics + transition). La séquence force Bompa (AA → max strength → conversion) guide un macro « force » classique ; **exception Macro 1 Build** : Accumulation **gym** (ACC-GYM) prime sur AA force, car c’est la qualité limitante (Issurin + profil) — athlète déjà en forme, on élève le plafond ; prudence charges (adducteur 2025), pas une phase de convalescence.

### 3.1 Long terme — année type CrossFit élite

Le CrossFit compétition a des opportunités **toute l’année** → Bompa recommande plutôt un plan **à 2 ou 3 macrocycles** (bi/tri-pic) qu’un seul grand pic saisonnier.

```text
ANNÉE (instance 2026 — reste de saison post-Battle)
├── Macrocycle 1 (Build → pic B Fire)         ~7 semaines (août → mi-sept.)
├── Macrocycle 2 (Élévation)                  ~8 semaines (mi-sept. → mi-nov.)
├── Macrocycle 3 (Spécifique + pic C S7mbioz) ~4 semaines (mi-nov. → mi-déc.)
└── Transition / compensation                 ~2–3 semaines (dès mi-déc.)
```

*(Gabarit générique Bompa : macros plus longs possibles quand le calendrier le permet. Ici les fenêtres sont **compressées** pour ancrer les REAL sur Fire Contest puis S7mbioz.)*

Chaque **macrocycle** est construit à la Issurin comme un ou deux **stages** (~6–8 semaines chacun, ajustable) :

| Phase du stage | Intention | Contenu typique CF |
|----------------|-----------|---------------------|
| **Accumulation** | Volume / capacités de base concentrées | Z2, force structurelle (AA→force), volume gym (Low), technique Oly |
| **Transmutation** | Conversion vers spécifique | Densité gym sous fatigue, puissance barre, mixed CF, VO2 dosé |
| **Realization** | Expression + fraîcheur | Spécifique compétition ↓ volume, mock events, taper court |

**Résidus (Issurin)** : on séquence pour que les qualités à résidu court (vitesse / spécificité / intensité nerveuse) soient **les plus proches** du pic ; les qualités à résidu long (aérobie, hypertrophie/structure) peuvent être plus tôt dans le stage.

### 3.2 Types de mesocycles concentrés (pas une liste BON figée)

Un meso = **3–5 semaines** + deload (Israetel), **une intention dominante** :

| Code | Intention dominante | Sources |
|------|---------------------|---------|
| ACC-GPP | Capacité de travail + Z2 + tissus | Issurin Acc · Bompa AA · Bible PP |
| ACC-GYM | Volume / skill gym | Low · Issurin Acc |
| ACC-STR | Force max / structure | Zatsiorsky · Israetel · Bompa Max Strength |
| ACC-OLY | Haltéro technique + power | Everett |
| TRA-MIX | Conversion mixed CF (gym+barre+ergo sous fatigue) | Verkhoshansky SST · Issurin Trans |
| TRA-POW | Puissance / densité / bar cycling | Everett · Verkhoshansky |
| REAL | Spécifique + peaking / taper | Issurin Real · Bompa peaking |
| TRANS | Décharge, compensation, fun GPP | Bompa transition |

On **répète** et **alterne** ces blocs dans l’année selon le calendrier compétitions et les résidus — on ne fait **pas** une seule fois FORCE puis GYM puis HALTÉRO puis SPEC.

> **Générique vs instance.** Les sections 3.3 et 3.4 racontent le raisonnement de la saison en cours ; le calendrier qui fait foi (fenêtres, numéros de semaine, points de mesure, paliers de réathlétisation) est dans `knowledge/instances/saison-2026.yaml`. Les gates, les doses de maintien et les caps n’en contiennent plus.

### 3.3 Macrocycle 1 en cours (3 août – 20 sept. 2026) — Build → Fire Contest (B)

Contexte : athlète déjà en forme (élite) ; Macro 1 = **Build** pour élever encore le plafond gym, puis **exprimer** sur le pic B. Priorité gym (qualité limitante, validée). Prudence charges / pas PRs pré-blessure (adducteur 2025) — ce n’est pas une phase de convalescence.

**Ancres** : Fire Contest (~12–13 sept., rôle B) puis S7mbioz (12–13 déc., rôle C). Fire = pic secondaire (maintien de forme) → pas de taper A ultra-long ; ACC-STR et TRA-MIX longs sont **reportés en Macro 2**.

| Semaines | Bloc | Pourquoi (livres) |
|----------|------|-------------------|
| 3–9 août | **Benchmarks** | Calibrage Israetel (MEV/MRV) |
| 10 août – 6 sept. (~4 sem.) | **ACC-GYM** | Accumulation concentrée sur la qualité limitante (Issurin + Low) ; 4ᵉ sem. = deload / pré-Fire |
| 7–13 sept. | **REAL** (Fire Contest) | Pic B ancré (Bompa) — expression + fraîcheur, taper court |
| 14–20 sept. | **TRANS** mini | Digérer le B avant Macro 2 |

**Maintien pendant les blocs** → doses chiffrées dans `knowledge/maintenance-doses.yaml` (résidus Issurin).  
**Passage de meso** → gates dans `knowledge/meso-gates.yaml` (pas calendrier seul).

### 3.4 Macrocycles 2 et 3 (post-Fire → S7mbioz) — instance 2026

REAL ancrés sur B puis C (Bompa multi-peak) :

| Macro | Fenêtre | Séquence | Pic |
|-------|---------|----------|-----|
| **Macro 2 — Élévation** | 21 sept. – 15 nov. | ACC-STR (~3) → TRA-POW (~2) → TRA-MIX (~3) | — (pas de taper A) |
| **Macro 3 — Spécifique** | 16 nov. – 13 déc. | TRA-MIX team (~2) → REAL S7mbioz (~2) | Pic C 12–13 déc. |
| **Transition** | dès 14 déc. (~2–3 sem.) | Volume bas, GPP, Z2 | — |

Sans date de comps : on enchaînerait Macro 2 sur le même canevas Issurin en changeant l’accent Accumulation. Ici les dates B/C sont connues → calendrier ci-dessus.

**Instance 2026 — TRA-POW plutôt qu’ACC-OLY** : le bloc haltéro de ~2 sem. après ACC-STR est une **conversion puissance** (Bompa / Verkhoshansky), pas une accumulation Everett de 3–5 sem. ACC-OLY reste un type de meso valide ; il n’est pas le meso 2 de cette saison.

**Révision Macro 2 du 2026-09-11 (3/2/3)** — détail et conflits d’auteurs dans `arbitrages.md` §15 :

| Bloc | Fenêtre | Semaines |
|------|---------|----------|
| ACC-STR | 21 sept. – 11 oct. | S08 tronquée (vacances = décharge de milieu de bloc) · S09 charge · S10 pic |
| TRA-POW | 12 – 25 oct. | S11 = **décharge force + pivot** · S12 chargée |
| TRA-MIX | 26 oct. – 15 nov. | S13 qualité · S14 densité (simulation samedi) · S15 transfert puis volume ↓ |

**Ajouts du 2026-09-11 dans Macro 2** : deux expositions gym par semaine pendant le bloc force (la marche sur les mains passe au mardi) · bloc de réathlétisation adducteur sur le jour lower, prehab épaule sur les jours gym · relevé aérobie chiffré le samedi 10 octobre · deux des trois tests signature logés en S10, le troisième en S15.

Principes retenus pour l’instance : **la décharge de fin de bloc force est fondue dans la semaine de pivot** (volume force −40/50 %, intention barre) plutôt que posée en semaine isolée ; la semaine retirée à la force va au mixed (résidu court, plus proche du pic C) ; un lift plafonné se surcharge par **tension** (pause) et **densité** (repos réduit), pas par les kilos ; **1 bloc seuil/sem.** dès la 2ᵉ semaine d’accumulation et Z2 en **blocs écrits** (pas de finisher optionnel) pour éviter le détraining aérobie ; kipping en appui renversé **introduit dès Macro 2** (cran 3 strict stable) au lieu d’attendre TRA-MIX.

### 3.5 Court terme (microcycle)
Dans un meso concentré (Israetel) :
1. Volume adaptatif → 2. Surcharge → 3. Pic (densité/intensité) → 4. Deload (~−30 % volume)

Jours : Lun–Ven ≤90 min · Mercredi team si box · Samedi optionnel · Dimanche off ou Z2.
---

## 4. Principes de dose (tous domaines)

- Travailler au-dessus du **MEV**, viser **MAV**, ne pas vivre au-delà du **MRV**.
- Deload dès signes : sommeil, chute perf, RPE excessif chronique, douleur signalée.
- Intensité : RPE / % sur **benchmarks actuels**, jamais PRs pré-blessure.
- Progression : d’abord volume/qualité reps, ensuite charge.
- **Doses déclarées et auditées** : chaque semaine annonce ses volumes (séries force, gestes de barre, minutes de skill, minutes de Zone 2, efforts durs) en tête de fichier. `npm run lint:prog` les confronte au profil, aux doses de maintien du meso et aux caps de la matrice conditioning. Une semaine peut sortir des bornes, à condition que ce soit déclaré et justifié.
- **Prescrire au niveau réel** : si l’athlète fait spontanément plus lourd que prescrit deux semaines de suite, la prescription est fausse — on ré-ancre les fourchettes, on ne répète pas la consigne.
- **Une seule source de chiffres** : `profile.volumes`. `volume-landmarks.yaml` ne donne que des ordres de grandeur pour démarrer ou détecter une valeur aberrante.

---

## 5. Domaines

### Force
- Patterns : squat, hinge, press, pull (Zatsiorsky).
- Accumulation : 70–85 % ressenti actuel, volumes contrôlés, tempo si tissus.
- Squats contrôlés (pas de max agressif) ; power / stance adaptés si besoin.
- Warm-up lower : `warmup_adductor_friendly` (mobilité hanches douce — standard lower, pas un « focus blessure »).

### Gym (priorité)
- Skill technique + volume (EMOM, densité) + renfo lesté (Low).
- Une qualité gym dominante par jour dans un meso GYM (ex. RMU / HSW / BMU / density).
- Ne pas junk-volume au détriment de la qualité.

### Haltéro
- Everett : technique + pulls + power ; fréquence modérée.
- Squat snatch/clean lourds : rares, submaximaux, stop si peur/douleur.

### Conditioning
- Maintien Z2 fréquent (préférence athlète).
- Matrice Z2 / tempo / glycolytique / alactique + caps : `knowledge/conditioning-matrix.yaml` (**pilote** Laursen & Buchheit ; Bible PP en socle FR).
- HI surtout en TRA/REAL ; team WOD dur compte dans le quota.
- **Ancres physiologiques** (`profile.aerobic_anchors`) : quand la FC plafond et l’allure de seuil sont relevées, la Zone 2 et les blocs seuil se prescrivent avec ces chiffres. Tant qu’une ancre manque, on prescrit en RPE — repli explicite, pas oubli. En cas de désaccord ancre / ressenti du jour, le ressenti gagne.

### Réathlétisation
- Une contrainte de plus d’un an ne se traite plus par l’évitement seul : paliers indolores, dose de 5 à 8 min deux fois par semaine, à la place d’un accessoire de même famille.
- Le plafond de charge ne se relève pas au feeling : critère à trois conditions, +2,5 kg maximum, annulation immédiate si la tension revient (`knowledge/reathletisation.md`).
- Les garde-fous de séance restent inchangés (pas de squat snatch / clean lourds, protocole douleur on-demand).

### Mental
- Actif en pré-comp : routines, focus, acceptation incertitude (Encyclopédie mentale).
- Routine identique avant chaque heat, un mot-clé de focus par WOD, débrief factuel court puis on referme (`knowledge/competition-day.yaml`).

---

## 6. Benchmarks (obligatoires avant premier meso chargé)

Étaler sur plusieurs midis 90 min :
- Force : BS, FS, DL, strict press, PU lesté (approches prudentes, pas ego)
- Oly : power snatch / power clean (+ technique squat léger si confort)
- Gym : proxies volume (ex. max sets submax BMU/RMU, HSPU strict, HSW distance)
- Ergo court : smoke test seulement

Mettre à jour le profil athlète actif → `prs_current_kg`, `gym_ladder_level`, `volumes.*` (MEV de départ).  
Gate : `knowledge/meso-gates.yaml` → `benchmarks_to_ACC_GYM`.

### 6bis. Tests signature et ancres (mesure continue)

Une semaine de tests dédiée est un luxe que le calendrier n’offre pas toujours. La mesure se fait donc **dans la prog** :

- **Trois tests figés** (`knowledge/signature-tests.yaml`), rejoués une fois par macrocycle, logés dans des séances déjà prévues : densité muscle-up en couplet, squat répétable (5×3 avec repos chronométré), seuil 5 × 3 min. Même protocole, même matériel, même ordre — sinon la comparaison ne vaut rien.
- **Ancres aérobies** relevées lors d’une sortie longue déjà programmée : FC plafond de Zone 2, allure de seuil, dérive sur les intervalles.
- Résultats → journal de la semaine, puis profil si le repère durable bouge.

Progresser, sur ces tests, c’est souvent **le même score avec plus de repos**, pas un score plus élevé.

---

## 7. Adaptation coaching

- Feedback post-séance (blocs Notes semaine) → ajuster volume/variante **sans changer l’intention du meso**.
- Planning ponctuel (vacances) → Z2 ou séance réduite (noter dans Notes de la semaine ; durable → profile).
- Douleur signalée (dont adducteur) → `knowledge/adductor-protocol.yaml` — **pas** de score quotidien demandé.
- Team RPE ≥ 8 → −volume J+1.
- **Boucle fermée** : chaque semaine passée se distille dans une entrée de journal (`athletes/<id>/journal/`, schéma `knowledge/journal-schema.yaml`). L’audit signale une semaine passée sans feedback ni entrée. Une boucle ouverte, c’est une semaine qui n’a servi à rien d’autre qu’à s’entraîner.
- **Écart prescrit / réalisé** : consigné semaine par semaine ; deux fois dans le même sens sur le même mouvement → on ré-ancre la prescription.

## 7ter. Compétition

La préparation d’un pic ne part pas des qualités mais de la demande :

| Document | Rôle |
|----------|------|
| `competition-demands.yaml` | Exigence → statut (couvert / partiel / trou) → preuve → action. Alimenté par le débrief par WOD et le book de l’épreuve. Pas de trou sans action, pas d’action sans trou. |
| `taper-protocol.yaml` | Affûtage chiffré sur quatorze jours : pourcentages de volume par fenêtre, dernier effort dur à J-7, intensité maintenue, décision anticipée pour le WOD team qui tombe dans les quatre derniers jours. |
| `competition-day.yaml` | Trame de journée : check-in, échauffement **par famille de WOD**, ravitaillement, récupération entre les heats, routines mentales, grille de débrief. |

Deux règles issues de septembre 2026 : pendant l’affûtage, prescrire les **charges habituelles** (des charges basses « de sécurité » ne sont pas suivies) ; et **tout mouvement sensible doit avoir été ouvert dans la semaine**, jamais découvert le jour J.

## 7bis. Ops pack (cohérence opérationnelle) — 2026-07-28

Fichiers normatifs (en plus de cette méthodo) :

| Fichier | Rôle |
|---------|------|
| `maintenance-doses.yaml` | Minima hors focus (résidus) |
| `meso-gates.yaml` | Critères de sortie de meso |
| `gym-ladder.md` | Progressions BMU/RMU/HSPU/HSW |
| `session-patterns.yaml` | Ids de séances obligatoires |
| `warmups.yaml` | Warm-ups réutilisables |
| `adductor-protocol.yaml` | Arbre douleur (on-demand si signalée) |
| `reathletisation.md` | Paliers adducteur et épaule, critère de relèvement du plafond |
| `conditioning-matrix.yaml` | Caps energy systems + ancres physiologiques |
| `volume-landmarks.yaml` | Ordres de grandeur MEV/MAV/MRV (référence, pas source) |
| `journal-schema.yaml` | Schéma d’une entrée de journal athlète |
| `signature-tests.yaml` | Trois protocoles figés rejoués par macro |
| `competition-demands.yaml` | Exigences de compétition → trous → actions |
| `competition-day.yaml` | Trame de journée de compétition |
| `taper-protocol.yaml` | Affûtage chiffré des quatorze derniers jours |
| `instances/<saison>.yaml` | Calendrier, chemin de mesos, points de mesure — **tout ce qui est daté** |

Templates : `prog/_templates/semaine.md` · `prog/_templates/meso.md`  
Lint : `npm run lint:prog` — forme (`scripts/lint-prog.py`) **et** doses, caps, boucle de feedback (`scripts/audit-prog.py`)

**Règle de séparation** : aucune date ni numéro de semaine dans les fichiers génériques ; aucun historique dans le profil ; aucun chiffre de volume ailleurs que dans le profil.

---

## 8. Ce que cette méthodo n’est pas

- Une copie HWPO/Mayhem
- Une copie du cycle BON-2026
- Un programme bodybuilding
- Du concurrent « force+gym+oly+VO2 max » chaque semaine

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
- [x] Macro 1 août–sept. 2026 : Benchmarks → ACC-GYM → REAL (Fire B) → TRANS ; ACC-STR → TRA-POW → TRA-MIX en Macro 2 → REAL (S7mbioz C)

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
