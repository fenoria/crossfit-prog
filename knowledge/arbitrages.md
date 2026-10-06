# Arbitrages méthodologiques — en vigueur

Rôle : conflits **entre auteurs** + décision retenue, tous **validés avec l’athlète** (dates par §).
Version condensée : décisions et garde-fous seulement. Raisonnement complet, constats chiffrés et amendements successifs → `knowledge/arbitrages-archive.md` (même numérotation, lecture à la demande).
Calendrier (fenêtres, semaines, samedis utiles) → `knowledge/instances/<saison>.yaml` · état athlète → profil actif. Ne pas dupliquer ici.
Nouvel arbitrage : ajouter un § numéroté ici (format court) ; si un § en remplace un autre, réécrire l’ancien en une ligne « remplacé par §N ».

## 1. Structure de cycle : Issurin vs Bompa « traditionnel » (2026-07-27)
- **Décision** : **Issurin pilote** la séquence des mesos (blocs concentrés + résidus). Bompa sert au **macro** (pics, taper, vocabulaire).
- **Pourquoi** : 90 min/jour — impossible de tout développer à fond chaque semaine ; meilleur ROI en concentrant.

## 2. Dose volume : Israetel vs « plus c’est dur mieux c’est » (2026-07-27)
- **Décision** : **MEV/MAV/MRV + deloads** Israetel pour toutes les qualités (force, gym, Oly).
- **Pourquoi** : adducteur résiduel + 42 ans + haute fréquence midi → la récupération est le goulot.

## 3. Force : Zatsiorsky/Verkhoshansky vs bodybuilding (2026-07-27)
- **Décision** : force structurelle + SST orientée CF ; splits hypertrophie / machines écartés (Manuel muscu = accessoires seulement).

## 4. Haltéro : Everett haute fréquence vs réalité agenda (2026-07-27)
- **Décision** : technique Everett + **fréquence modérée** ; power / hangs / pulls prioritaires ; squat snatch/clean lourds = exposition rare et contrôlée.

## 5. Gym : Low vs volume WOD aléatoire (2026-07-27)
- **Décision** : progressions et volume **Low** (densité, EMOM skill, renfo) en meso dédié ; pas seulement « gym dans le WOD ».

## 6. Conditioning : Laursen & Buchheit vs « plus de HI = mieux » (2026-07-29)
- **Décision** : **Laursen & Buchheit pilote** filières / formats HIIT (`conditioning-matrix.yaml`) ; Bible PP = socle FR / variété ; Issurin/Bompa = placement Acc vs TRA/REAL. **Ne pas sur-stimuler** (conditioning déjà fort) : cible physiologique avant format.

## 7. Mental (2026-07-27)
- **Décision** : Encyclopédie mentale surtout pré-comp / taper (routines, stress), pas au détriment du physique en Accumulation.

## 8. Template BON (2026-07-27)
- **Décision** : BON n’inspire que la **forme** d’une semaine. FORCE→GYM→HALTÉRO→SPEC = peaking one-shot, **écarté** comme modèle annuel.

## 9. Architecture annuelle (2026-07-27)
- **Décision** : année = **2–3 macrocycles** (Bompa multi-pics) ; chaque macro = Acc → Trans → Real (Issurin) ; mesos = intentions concentrées répétables. Séquence 2026 réelle → instance.

## 10. Ops pack (2026-07-28)
- **Décision** : pack normatif sous `knowledge/` + templates + lint. `profile.volumes` = instance ; `volume-landmarks.yaml` = bornes. Code meso canon `REAL`. Z2 : MEV 60 en Accumulation ; < MEV autorisé en REAL (fraîcheur).

## 11. Build : GYM avant AA force (2026-07-28)
- **Décision** : quand la qualité limitante est la gym et le pic B tôt, l’Accumulation commence par **ACC-GYM** ; ACC-STR après le pic B. Libellé **Build** (pas « reconstruction ») : athlète en forme, prudence charges ≠ convalescence.

## 12. Calendrier ancré sur les compétitions (2026-07-29, amendé §15 et §26)
- **Décision** : les REAL s’ancrent sur les compétitions datées ; un pic **B** = expression / maintien, pas un taper A qui casse le Build. Fenêtres → instance.

## 13. Variation des accessoires vs spécificité des lifts (2026-09-11)
- **Décision** : **lifts et skills stables sur le meso** (surcharge Zatsiorsky / Israetel). **Accessoires = nouvelle banque à chaque meso** (1–2 mouvements). Formats gym/oly légèrement rotatifs (EMOM vs sets ; hangs / pulls / power) — pas de nouveaux skills gratuits.
- **Pas** : rotation hebdo type conjugate ; isolation bodybuilding ; 3e press si gêne épaule. Tirage horizontal = trou à combler, pas du « fun ».
- **Ops** : `session-patterns.yaml` (`accessory_rotation`). Deload = mêmes mouvements, volume −30 %.

## 14. Bloc haltéro post-force : TRA-POW plutôt qu’ACC-OLY (2026-09-11)
- **Décision** : après ACC-STR, un bloc barre de ~2 sem. = **conversion puissance** (Bompa, Verkhoshansky, résidu court), pas une accumulation Everett. ACC-OLY reste un type valide (3–5 sem. + deload).

## 15. Macro force → puissance → mixed en 3/2/3, décharge fondue dans le pivot (2026-09-11)
- **Décharge** : la semaine de décharge force **est la première semaine du bloc puissance** (volume force −40/50 %, RPE ≤ 6,5, pas de deadlift, intention barre) — deload Israetel + pivot Issurin, pas de semaine vide en plus.
- **Durées** : force 3 sem. · puissance 2 · mixed 3 ; la semaine retirée à la force va au mixed (résidu court).
- **Lift plafonné** (squat ≤ 115 kg) : surcharger par (1) les patterns où il reste de la marge réelle, (2) la **tension** (pause), (3) la **densité** (repos réduit) — pas par les kilos.
- **Prescription barre ancrée sur le réel** : fourchettes sur le ressenti réel, pilotage RPE + vitesse, pas % théorique → `volumes.*.load_anchoring` du profil.
- **Conditioning en accumulation** : **1 bloc seuil/sem.** (12–20 min, RPE 6–7) dès la 2e semaine de force ; **Z2 en blocs écrits** (pas de finisher « si temps »). Pas de HI ajouté.
- **Kipping en appui renversé** : introduit avant TRA-MIX si cran 3 strict stable, sous règle de rampe épaule (§16) — état courant dans le profil.
- **Mesure** : retest par la prog (pas de semaine de tests dédiée) — points de mesure dans l’instance.

## 16. Blessure ancienne : évitement vs recharge progressive (2026-09-11)
- **Décision** : garder tous les garde-fous en séance (pas de squat snatch / clean lourds, protocole douleur inchangé, pas de montée un jour de fatigue) **et** recharger : `reathletisation.md`, 2×/sem., paliers isométrie → Copenhagen court → long → amplitude chargée → transfert, avec **critère chiffré** de relèvement du plafond (+2,5 kg max, trois conditions, annulation si la tension revient).
- **Épaule** : `warmup_shoulder_care` sur jours gym + **règle de rampe** (le volume ne monte que si les deux dernières séances sont passées sans gêne).
- **Pourquoi** : l’évitement avait créé un plafond permanent (squat sous-exploité de 15 à 45 kg).

## 17. Ops pack déclaratif vs vérifié (2026-09-11)
- **Décision** : chaque semaine **déclare ses doses** (`<!-- dose: … -->`) ; `scripts/audit-prog.py` les confronte au profil, au maintien et aux caps conditioning, et signale semaine passée sans feedback/journal et écart répété 2 semaines. Exemption assumée → `exempt=` + `dose-note`.
- **Séparation** : profil = état courant · journal = historique · instance = calendrier · `knowledge/` = générique. `profile.volumes` = seule source des cibles.

## 18. Prescription au ressenti vs prescription ancrée (2026-09-11)
- **Décision** : `aerobic_anchors` au profil, relevées dans des séances existantes ; la matrice prescrit par ancre quand elle existe, **repli RPE** si `null`. **Tests signature** figés (`signature-tests.yaml`) rejoués une fois par macro.
- **Garde-fou** : désaccord ancre / ressenti du jour → le ressenti gagne.

## 19. Compétition : qualités générales vs exigences réelles (2026-09-11)
- **Décision** : à l’approche d’un pic, partir de la demande de l’épreuve — `competition-demands.yaml` (exigence → statut → preuve → action), `taper-protocol.yaml` (volumes par fenêtre, dernier effort dur J-7, décision anticipée pour un team dans les 4 derniers jours), `competition-day.yaml`.
- **Trou assumé** : squat clean / squat snatch au standard hors plan tant que la règle blessure tient.

## 20. Qualités périodisées vs étendue des mouvements CrossFit (2026-10-02, révisé §26)
- **Décision** : (1) famille de mouvements = dimension à part entière, déclarée (`mixed=`) et auditée (minimum par semaine selon le meso, six familles par meso) — `movement-coverage.yaml` ; (2) dose basse et fréquente (6–10 min, RPE 6–7) hors blocs mixed, sans voler le stimulus dominant ; (3) mouvements du WOD team notés dans le feedback.
- **Ce qui ne change pas** : blocs à intention dominante (Issurin) — la variété est un **maintien**.

## 21. Conversion puissance : volume réduit vs changement de régime (2026-10-03)
- **Décision** : en TRA-POW, **aucune série lourde et lente pour elle-même**. Le lourd est remplacé par la vitesse (squat ~60 %, push press, traction explosive légère) ou **immédiatement suivi** d’un geste explosif (contraste squat 2 reps → 30 s → box jumps). Sauts et lancers = moyens du bloc ; singles barre pour le relevé ; complexes à la place des tirages lourds.
- **Garde-fous** : réceptions sur la box ou tenues (adducteur) ; douleur d’épaule ≥ 3/10 → arrêt (push press et pompes explosives compris) ; pas de squat snatch ; pas de depth jump tant que le palier long adducteur n’est pas passé.

## 22. Placement force / conditioning : ordre et voisinage (2026-10-03)
- **Décision** : (1) **la qualité prioritaire du bloc ouvre la séance**, toujours ; le conditioning dur après ou un autre jour. (2) En ACC-STR / TRA-POW, **pas de conditioning des jambes au-dessus de la Z2 avant la force explosive des jambes** dans la même séance (échauffement excepté) ; si un cardio doit précéder → séance commencée par le haut du corps. Après un team dur ou une sortie dure la veille → haut du corps ou technique en tête. (3) Sortie longue Z2 du week-end compatible avec la force du lundi (≥ 8 h). (4) En bloc force, Z2 de préférence **vélo, rameur ou ski** plutôt que course.
- **Sources** : Schumann & Rønnestad (délais, haut du corps non affecté, vélo interfère moins) · Viada · Schlegel.

## 23. Travail de vitesse en conversion : Viada vs Verkhoshansky / Zatsiorsky (2026-10-03)
- **Décision** : **maintenir §21** (le corpus force pilote). Nuances Viada : (a) TRA-POW **court**, ne déborde pas en TRA-MIX ; (b) en TRA-MIX, barre en **cadence efficiente**, pas en vitesse maximale.

## 24. Force maximale vs force-endurance (2026-10-03)
- **Décision** : (1) **pas de nouveau bloc ACC-STR dans la saison** sans trou de force identifié dans `competition-demands.yaml` ; (2) **force-endurance 70–80 %** (5–10 reps en densité ou sous fatigue) = moyen explicite en TRA-MIX et en maintien ; (3) force max **entretenue** (1 stimulus lourd/sem. hors focus), pas poursuivie.
- **Pourquoi** : force = ticket d’entrée (Viada) ; elle prédit les WODs lourds et courts, la gym sous fatigue prédit le reste (Butcher, Dexheimer, Mangine).

## 25. Blocs planifiés vs WODs imprévus (écarté 2026-10-03)
- **Écarté** par l’athlète : pas d’exposition chronométrée systématique d’un mouvement faible à chaque meso. On s’en tient à §20. Ne pas reproposer sans fait nouveau.

## 26. Pas de compétition proche → accumulation gym, cap sur l’Open 2027 (2026-10-03)
- **Décision** : (1) **Macro 3 = ACC-GYM** : 4 semaines en montée (traction kipping → butterfly → C2B, T2B, corde, pompes en appui renversé selon l’épaule, couplets muscle-up) + 1 semaine décharge / relevés / tests signature ; (2) transition de fin d’année ; (3) conversion Open en janvier 2027 (à cadrer). (4) Pas de simulation perso ni pic de remplacement. (5) Butterfly / C2B : technique + volume bas → modéré si traction ≤ 2/10, volume en format en janvier.
- **Pourquoi** : sans échéance proche, accumulation concentrée (Issurin) ; à l’Open, la régularité des séries de gym prédit le classement (Mangine) ; §24.
- **Ce qui ne change pas** : Macro 2, règles blessure et épaule, §20 ; trous team gardés dans `competition-demands.yaml` pour Battle 2027.
