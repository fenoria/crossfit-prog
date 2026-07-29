# Arbitrages méthodologiques

Décisions corpus **validées** avec l’athlète (2026-07-27) · ops pack (2026-07-28) · Laursen/Buchheit (2026-07-29) · calendrier B/C (2026-07-29).  
Rôle : conflits **entre auteurs** + décision retenue.  
Contraintes athlète / calendrier / feedback durable → `athlete/profile.yaml` (ne pas tout dupliquer ici).

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
  - Macro 2 (21 sept. – 15 nov.) : ACC-STR → ACC-OLY → TRA-MIX (élévation, pas de taper A).
  - Macro 3 (16 nov. – 13 déc.) : TRA team → **REAL S7mbioz (C)**.
  - Transition dès 14 déc.
- Fire = pic **secondaire** (expression / maintien) — pas un taper A qui casse le Build.
- SoT dates : `athlete/profile.yaml` (`competitions` + `competition` / `next_after_b`).
