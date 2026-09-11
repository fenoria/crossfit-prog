# Arbitrages méthodologiques

Décisions corpus **validées** avec l’athlète (2026-07-27) · ops pack (2026-07-28) · Laursen/Buchheit (2026-07-29) · calendrier B/C (2026-07-29) · variation accessoires (2026-09-11) · TRA-POW Macro 2 (2026-09-11) · révision Macro 2 en 3/2/3 (2026-09-11) · **§16 à §19 : chantier méthodo v2 du 2026-09-11, validé avec l’athlète le jour même**.  
Rôle : conflits **entre auteurs** + décision retenue.  
Contraintes athlète / calendrier / feedback durable → profil athlète actif (`athletes/<id>/profile.yaml`) (ne pas tout dupliquer ici).

## 1. Structure de cycle : Issurin vs Bompa « traditionnel »
- **Conflit** : Bompa/classique = développement concurrent de nombreuses qualités ; Issurin = blocs concentrés + résidus.
- **Décision** : **Issurin pilote** la séquence des mesos. Bompa sert au **macro** (pics, taper, vocabulaire).
- **Pourquoi** : CrossFit élite + 90 min — impossible de tout développer à fond chaque semaine ; meilleur ROI en concentrant (ex. meso gym volume).

## 2. Dose volume : Israetel vs « plus c’est dur mieux c’est »
- **Décision** : **MEV/MAV/MRV + deloads** Israetel pour réguler toutes les qualités (force, gym, Oly).
- **Pourquoi** : adducteur résiduel + âge 42 + haute fréquence midi → la récupération est le goulot ; progresser sous MRV.

## 3. Force : Zatsiorsky/Verkhoshansky vs bodybuilding
- **Décision** : force structurelle + SST orientée CF ; **écarter** splits hypertrophie purs / machines (Manuel muscu = accessoires seulement).
- **Pourquoi** : transfert compétition (Verkhoshansky) > esthétique.

## 4. Haltéro : Everett haute fréquence vs réalité agenda
- **Décision** : technique Everett + **fréquence modérée** ; power / hangs / pulls prioritaires ; squat snatch/clean lourds = exposition rare et contrôlée.
- **Pourquoi** : profil frileux + adducteur + multi-domaines.

## 5. Gym : Low vs volume WOD aléatoire
- **Décision** : progressions et volume **Low** (densité, EMOM skill, renfo) dans un meso dédié ; pas seulement « gym dans le WOD ».
- **Pourquoi** : faiblesse principale = répétabilité gym.

## 6. Conditioning : Laursen & Buchheit vs « plus de HI = mieux »
- **Conflit** : surcharger le glycolytique / hero WODs vs dose HIIT ciblée.
- **Décision** : **Laursen & Buchheit pilote** energy systems / formats HIIT (`conditioning-matrix.yaml`) ; Bible PP = socle FR / variété ; Issurin/Bompa = placement Acc vs TRA/REAL. **Ne pas sur-stimuler** (conditioning déjà fort).
- **Pourquoi** : cible physiologique avant format ; Z2 + HI placé > accumulation HI gratuite.

## 7. Mental
- **Décision** : Encyclopédie mentale active surtout pré-comp / taper (routines, stress), pas au détriment du travail physique en Accumulation.

## 8. Template BON-2026
- **Décision** : l’export BON n’inspire que la **forme** d’une semaine (jours + notes). La séquence FORCE→GYM→HALTÉRO→SPEC = peaking one-shot, **écartée** comme modèle annuel. Sortie actuelle = Markdown `prog/` + VitePress (plus Notion).

## 9. Architecture annuelle (2026-07-27)
- **Conflit** : copier les mesos BON sur 1 an vs Issurin stages + Bompa multi-pic.
- **Décision** : année = **2–3 macrocycles** ; chaque macro = Acc → Trans → Real ; mesos = intentions concentrées répétables (ACC-GYM, ACC-STR, TRA-MIX, REAL…).
- **Macro 1 (initial)** : Benchmarks → ACC-GYM → ACC-STR → TRA-MIX → REAL (label mini) → TRANS.
- **Validé athlète** 2026-07-27.
- **Amendement 2026-07-29** : voir §12 (compression Macro 1 sur Fire Contest B).

## 10. Ops pack (2026-07-28)
- **Conflit** : méthodo narrative seule vs contrôles opérationnels (volume, maintien, gates).
- **Décision** : pack normatif sous `knowledge/` + templates meso/semaine + lint.
- **Volumes** : `profile.volumes` = instance ; `volume-landmarks.yaml` = bornes (Z2 déjà calibré).
- **Canon** : code meso `REAL` (label « REAL mini » OK en prose).
- **Z2** : MEV 60 en Accumulation ; min < MEV autorisé en REAL (fraîcheur).

## 11. Macro 1 Build : GYM avant AA force (2026-07-28)
- **Conflit** : séquence Bompa AA → max strength vs qualité limitante gym.
- **Décision** : Macro 1 Accumulation = **ACC-GYM** d’abord (athlète déjà en forme — Build pour élever le plafond ; prudence charges adducteur 2025, pas convalescence). ACC-STR suit **après** le pic B (Macro 2), pas avant Fire Contest.
- **Libellé** (2026-07-29) : abandon de « reconstruction » → **Build** partout (visible + méthodo).

## 12. Calendrier 2026 ancré B/C (2026-07-29)
- **Conflit** : Macro 1 long (~15 sem. jusqu’à REAL générique) vs Fire Contest ~12 sept. + S7mbioz 12–13 déc.
- **Décision** :
  - Macro 1 (3 août – 20 sept.) : Benchmarks → ACC-GYM → **REAL Fire (B)** → TRANS mini.
  - Macro 2 (21 sept. – 15 nov.) : ACC-STR → **TRA-POW** → TRA-MIX (élévation, pas de taper A). *(Amendement 2026-09-11 : voir §14.)*
  - Macro 3 (16 nov. – 13 déc.) : TRA team → **REAL S7mbioz (C)**.
  - Transition dès 14 déc.
- Fire = pic **secondaire** (expression / maintien) — pas un taper A qui casse le Build.
- SoT dates : profil athlète actif (`competitions` + `competition` / `next_after_b`).

## 13. Variation des accessoires vs spécificité des lifts (2026-09-11)
- **Conflit** : cloner le même menu (dead bug + Pallof + RDL 3×8 + EMOM BMU/RMU + power singles) d’un meso à l’autre vs rotation conjugate weekly des mouvements principaux.
- **Décision** : **lifts et skills stables sur le meso** (Zatsiorsky / Israetel — surcharge). **Accessoires = nouvelle banque à chaque meso** (Manuel muscu : 1–2 mouvements, reste de budget). Formats gym/oly légèrement rotatifs (Low : EMOM vs sets ; Everett : hangs / pulls / power) — pas de nouveaux skills gratuits.
- **Pas** : rotation hebdo type conjugate (dilue le stimulus) ; isolation bodybuilding ; 3e press si gêne épaule.
- **Pourquoi** : accommodation et ennui sur les accessoires ≠ variation des lifts qui portent le ROI du bloc. Tirage horizontal manquant = trou Zatsiorsky, pas du « fun ».
- **Ops** : banques dans `knowledge/session-patterns.yaml` (`accessory_rotation`). Deload = mêmes mouvements, volume −30 %.

## 14. Macro 2 : TRA-POW plutôt qu’ACC-OLY (2026-09-11)
*(Choix du type de bloc confirmé ; la répartition des semaines est amendée en §15.)*
- **Conflit** : 2 semaines haltéro après ACC-STR = accumulation Everett (ACC-OLY, meso 3–5 sem. + deload) vs conversion puissance (TRA-POW).
- **Décision** : instance 2026 = **TRA-POW** (~2 sem., 19 oct. – 1er nov.). ACC-OLY reste un type valide ; on ne l’utilise pas ici. On ne vole pas de semaine à TRA-MIX ni on n’allonge ACC-STR (S08 déjà tronquée).
- **Pourquoi** : après max strength, power / pulls / hangs = transmutation (Bompa, Verkhoshansky, Issurin résidu court). Deux semaines sans deload dédié ne sont pas une accumulation oly.
- **Ops** : gates `ACC_STR_to_TRA_POW` → `TRA_POW_to_TRA_MIX` ; dossier `meso-02-conversion-puissance/`.

## 15. Macro 2 rééquilibré 3/2/3 + décharge fondue dans le pivot (2026-09-11)

Amende §14 (répartition des semaines) et §12 (fenêtres de mesos). Révision de fond de Macro 2 avant son démarrage.

- **Conflit 1 — où placer la décharge** : Israetel = deload dédié après le pic de meso ; Issurin = au pivot de bloc, on coupe le stimulus dominant et l’intention change. Le calendrier ajoutait un troisième facteur : S08 tronquée + 5 jours de vacances (24–28 sept.) = décharge déjà présente au milieu du bloc. Le plan initial chargeait donc 2 semaines (S09–S10) pour 1 semaine tronquée + 1 deload complet.
- **Décision** : **la semaine de décharge force est la première semaine du bloc puissance** (S11 : volume force −40/50 %, RPE ≤ 6,5, pas de deadlift, intention barre). Un deload Israetel valide (volume coupé, charges relatives tenues) qui sert aussi de pivot Issurin. Pas de semaine « vide » en plus.
- **Conflit 2 — combien de semaines pour la force** : Bompa/Zatsiorsky = bloc max strength de 3–5 semaines ; profil = squat plafonné (tension dès ~120 kg, charge de travail bornée à 115) et faiblesse n° 1 = répétabilité gym sous fatigue.
- **Décision** : **ACC-STR 3 semaines** (21 sept. – 11 oct.) · **TRA-POW 2** (12–25 oct.) · **TRA-MIX 3** (26 oct. – 15 nov.). La semaine retirée à la force va au mixed, dont le résidu est court et qui sert directement le pic C du 12–13 décembre (Issurin : qualités à résidu court près du pic).
- **Conflit 3 — surcharger un lift plafonné** : ajouter des séries indéfiniment (Israetel) vs progresser en charge (Zatsiorsky, impossible ici).
- **Décision** : trois leviers explicites — (1) charger les patterns où il reste de la marge réelle (deadlift en rampe 145 → 160, traction lestée +36–40 alors qu’un single à +52 a été tenu, strict press) ; (2) **tension** via front squat avec pause 2 s à charge plus basse ; (3) **densité** (repos du back squat ramené à 2’ en semaine de pic). Le back squat reste à ≤ 115 kg.
- **Conflit 4 — prescription vs comportement réel** : les charges barre prescrites étaient systématiquement sous le niveau réel (S04 : 62,5–65 prescrit / 70 fait à RPE 7 ; 87,5–90 prescrit / 100 fait à RPE 7 ; idem S06). L’athlète exécute ses charges habituelles → la prescription perd sa valeur et le journal devient faux.
- **Décision** : ancrer les fourchettes barre sur le ressenti réel (arraché puissance 65–72,5 · épaulé puissance 90–100 à RPE ≤ 7) et piloter par RPE + vitesse d’exécution, pas par un pourcentage théorique. Consigné dans `volumes.oly.load_anchoring` du profil.
- **Conflit 5 — conditioning en accumulation** : matrice (Laursen & Buchheit + profil « cardio fort → maintien ») = HI proscrit en ACC-STR, mais 6 semaines sans autre stimulus que le team du mercredi, avec un Z2 à 60 min rarement atteint, c’est du détraining déguisé.
- **Décision** : **1 bloc seuil par semaine** (12–20 min, RPE 6–7) dès la deuxième semaine du bloc force — la matrice l’autorise déjà (`tempo_threshold`, max 1/sem., « fin Accumulation »). Et **Z2 en blocs écrits** dans la séance (samedi impair 60–75’ ou dimanche 50’) au lieu de finishers « si le temps le permet ». Pas de HI ajouté en accumulation.
- **Conflit 6 — kipping en appui renversé** : « pas avant Fire » (verrou de Macro 1) vs ladder Low (cran 4 = intro kipping dès que le cran 3 strict est stable, ce qui est le cas depuis fin août : 5×10 strict).
- **Décision** : introduction progressive dès Macro 2 — drills (S08), volume court (S09), volume (S10), intégré aux couplets en TRA-MIX, relevé en S15. Skip au moindre inconfort d’épaule (gêne signalée en S05). `session-patterns.yaml` disait « kipping = TRA-MIX si cran 3 stable » : on anticipe d’un bloc pour que la skill soit utilisable en compétition, pas découverte en décembre.
- **Contrainte planning** : samedi disponible **uniquement les semaines ISO impaires** (profil mis à jour). Les samedis utiles de Macro 2 sont le 10 oct. (sortie longue + seuil), le 24 oct. (sortie longue + seuil) et le 7 nov. (simulation de journée de compétition). Semaines paires : Z2 au dimanche.
- **Ops** : `meso-gates.yaml` (deload force = semaine pivot acceptée ; kipping ajouté à l’entrée mixed) · `methodology.md` §3.4 · profil (`schedule.saturday`, `volumes`, `gym_ladder_level`, `benchmarks.measurement_plan`) · pas de semaine de tests dédiée : mesure en S10 (force), S12 (puissance), S15 (gym).

## 16. Blessure ancienne : évitement vs recharge progressive (2026-09-11)
- **Conflit** : prudence post-blessure (profil, `adductor-protocol.yaml`, interdiction du Copenhagen chargé) vs recharge progressive des tissus (Verkhoshansky : le transfert exige de charger le geste et le régime ; Bible PP : isométrique puis excentrique ; Low : paliers propres).
- **Constat** : un an après la désinsertion, l'évitement a produit un **plafond permanent** — squat de travail borné à 115 kg pour une tension ressentie à 120, alors que le 3RM de test est à 130 et le PR pré-blessure à 160. Ce n'est plus de la protection, c'est un déficit entretenu.
- **Décision** : garder tous les garde-fous en séance (pas de squat snatch ni clean lourds, protocole douleur inchangé, pas de montée un jour de fatigue) **et** ouvrir une piste encadrée — `knowledge/reathletisation.md`, 2 fois par semaine, paliers isométrie → Copenhagen court → Copenhagen long → amplitude chargée, avec un **critère chiffré de relèvement du plafond** (+2,5 kg maximum, trois conditions réunies, annulation immédiate si la tension revient).
- **Épaule** : même logique préventive — gêne signalée en S05 et rampe de kipping de S08 à S15 sans travail de tolérance. Ajout de `warmup_shoulder_care` et d'une règle de rampe (le volume ne monte que si les deux dernières séances sont passées sans gêne).
- **Pourquoi** : la faiblesse déclarée est la répétabilité gym, mais le plus gros gisement restant est un squat sous-exploité de 15 à 45 kg. Aucun bloc de force ne le récupérera tant que la contrainte est traitée comme définitive.
- **Ops** : `reathletisation.md` · `session-patterns.yaml` (Copenhagen progressif dans la banque anti-latérale) · `warmups.yaml` · profil (`injury.programming_rules`) · blocs intégrés dès S08.

## 17. Ops pack déclaratif vs vérifié (2026-09-11)
- **Conflit** : Israetel et Issurin fournissent des bornes chiffrées (MEV/MAV/MRV, doses de maintien, caps de filière) ; le repo les écrivait sans jamais les vérifier. `lint-prog.py` ne contrôlait que la forme.
- **Constat** : Zone 2 sous le MEV pendant trois semaines (S02–S04) et écart prescrit/réalisé sur la barre pendant sept semaines, tous deux détectés par relecture humaine tardive.
- **Décision** : chaque semaine **déclare ses doses** (`<!-- dose: … -->`) et `scripts/audit-prog.py` les confronte au profil, aux doses de maintien et aux caps de la matrice conditioning ; l'audit signale aussi une semaine passée sans feedback ni entrée de journal, et un écart répété deux semaines dans le même sens.
- **Exemptions** : une semaine peut sortir des bornes si c'est assumé (`exempt=` + `dose-note`), par exemple S08, tronquée par les vacances.
- **Effet immédiat** : l'audit a montré que le maintien gym tombait à une séance par semaine en S09 et S10 alors que `maintenance-doses.yaml` en exige deux pendant ACC-STR — corrigé par un touch gym court le mardi (la marche sur les mains passe du jeudi au mardi).
- **Séparation** : `profile.yaml` = état courant, `athletes/<id>/journal/` = historique (`knowledge/journal-schema.yaml`). Le profil ne porte plus de blocs `sXX_results`.
- **Générique vs instance** : les gates et les doses ne contiennent plus de dates ni de « SXX » — le calendrier vit dans `knowledge/instances/saison-2026.yaml`. `volume-landmarks.yaml` devient une référence d'ordres de grandeur ; la seule source utilisée par la prog et l'audit est `profile.volumes`.

## 18. Prescription au ressenti vs prescription ancrée (2026-09-11)
- **Conflit** : Laursen & Buchheit prescrivent le conditioning par intensité relative (FC, allure, puissance) ; la méthodo validée pilotait tout au RPE, y compris la Zone 2 et les blocs seuil. De même, la progression gym se jugeait sur des séances jamais rejouées à l'identique.
- **Constat** : sans ancre, la Zone 2 dérive vers le haut (elle devient du tempo qui coûte de la récupération) et le seuil dérive vers le bas. Et « ça progresse » restait une impression : aucun protocole répété à l'identique dans le dossier.
- **Décision** : (a) ajouter `aerobic_anchors` au profil, les relever dans une séance déjà prévue (samedi 10 octobre — contenu inchangé, on mesure), et faire prescrire la matrice conditioning par ancre quand elle existe, avec **repli explicite au RPE** quand elle vaut `null` ; (b) figer **trois tests signature** (`knowledge/signature-tests.yaml`) rejoués une fois par macro, tous logés dans des séances existantes.
- **Garde-fou** : en cas de désaccord entre l'ancre et le ressenti du jour, le ressenti gagne — l'ancre cadre la prescription, elle ne pilote pas la séance.

## 19. Compétition : qualités générales vs exigences réelles (2026-09-11)
- **Conflit** : la programmation partait des qualités (force, gym, filières) et des faiblesses ressenties. Verkhoshansky et Issurin exigent l'inverse à l'approche du pic : partir de la demande réelle de l'épreuve. Bompa chiffre l'affûtage ; la méthodo se contentait de « volume ↓, fraîcheur ↑ ».
- **Constat** : aucun document ne listait ce que la compétition demande, donc aucun trou n'était visible avant le jour J — objets lourds jamais manipulés hors team, synchronisation avec le partenaire réel non travaillée, kipping jamais ouvert la semaine d'une compétition. Et l'affûtage de septembre a laissé passer un team dur à J-3 faute de règle écrite.
- **Décision** : trois documents — `competition-demands.yaml` (exigence → statut → preuve → action, alimenté par le débrief par WOD), `taper-protocol.yaml` (pourcentages de volume par fenêtre, dernier effort dur à J-7, décision anticipée pour le team qui tombe dans les quatre derniers jours), `competition-day.yaml` (trame de journée, échauffement par famille de WOD, ravitaillement, routines).
- **Trou assumé** : squat clean et squat snatch au standard restent hors du plan tant que la règle blessure tient — c'est écrit comme un choix, pas laissé comme un angle mort.
