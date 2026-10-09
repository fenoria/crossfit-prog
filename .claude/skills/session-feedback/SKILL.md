---
name: session-feedback
description: Ingère le feedback post-séance ou hebdo, met à jour profil / prog, adapte la suite comme un coach. À utiliser quand l’athlète donne RPE, douleur, charges faites, reps manquées ou changement de planning après une séance, ou demande le feedback de la semaine (« feedback de la semaine », « on fait le feedback ») — dans ce cas, lancer le QCM interactif.
---

# Session feedback

Règles : **`.claude/rules/prog-writing.md`** (immutabilité, Notes) · **`.claude/rules/athlete-profile.md`** (profil).

**Zone 2 de fin de séance — toujours demander, pour chaque séance faite** (feedback d’une séance ou de la semaine, QCM ou collé) : l’athlète en fait au gré du temps restant, elle n’est pas écrite dans la séance (`coaching.z2_end_of_session` du profil). Question dédiée par jour : *Pas faite* / *Faite* → minutes + ergo via « Autre ». Ne jamais la déduire d’un « fait comme prescrit », ni la fondre dans la question d’exécution. Les séances Zone 2 **dédiées** (samedi / dimanche, ou jour dont l’intention est la Z2) se demandent à part (étape 4).

## Mode QCM (feedback hebdo — systématique)

Quand l’athlète **demande** le feedback de la semaine (sans le coller déjà rédigé) : le recueillir **par QCM interactif** (`AskUserQuestion`), pas par question ouverte. Préférence durable : `coaching.feedback_mode` du profil.

Préparation : lire la semaine dans `prog/` (séances prescrites, fourchettes de charge) et l’entrée journal précédente (`flags`, écarts `re_ancrer` / `surveiller`). Les questions sont **construites depuis la prescription de la semaine**, jamais génériques : nommer la séance et les charges prescrites dans le libellé.

Contraintes outil : ≤ 4 questions par appel, 2–4 choix par question, « Autre » (texte libre) toujours dispo → l’utiliser pour les chiffres (charges, minutes, score). Enchaîner les tours ; ne poser un tour de détail que si une réponse l’exige.

Tours (ne garder que ce que la semaine contient) :
1. **Exécution, un jour = une question** (jours prescrits uniquement, 2 appels si > 4 jours). Libellé : `Mardi — BS 4×3 @ 115 / DL 3×3 @ 150 : ?` · choix : *Fait comme prescrit* / *Fait, charges ou volume modifiés* / *Partiel* / *Non fait*.
   - **Zone 2 de fin de séance, un jour = une question** (jours faits uniquement) : `Mardi — Zone 2 en fin de séance ?` · choix : *Pas faite* / *Faite* (minutes + ergo via « Autre »).
2. **Détail des écarts** — seulement pour les jours ≠ *comme prescrit* : quoi (mouvements sautés / charges réelles via « Autre ») et pourquoi (*Fatigue* / *Gêne-douleur* / *Temps* / *Choix*).
3. **Intensité ressentie** : position de la barre / force vs fourchettes (*En dessous* / *Dans la cible* / *Au-dessus, facile* / *Au-dessus, dur*), RPE upper et lower si séances de force (*≤ 6* / *7* / *8* / *9+*), **RPE team WOD** (*≤ 6* / *7* / *8* / *9+* — ≥ seuil profil ⇒ étape 4).
4. **Team WOD + volumes non chronométrés** : mouvements + charges du WOD team (« Autre », exigé par `team_wod_log_movements`) ; Zone 2 de la séance dédiée (*Comme prescrit* / *Moins* / *Plus* / *Pas faite*, minutes via « Autre ») ; total Z2 de la semaine (fin de séance + dédiée) vs plancher profil ; réathlé / accessoires prescrits faits ? (*Oui* / *En partie* / *Non*).
5. **Récup & signaux MRV** (choix multiples) : *Rien à signaler* / *Sommeil dégradé* / *Fatigue générale / perf en baisse* / *Gêne ou douleur*. Douleur : ne **pas** interroger par défaut (règle profil) — on ne détaille que si l’athlète coche *Gêne ou douleur*, ou si un flag douleur est **ouvert dans le journal précédent** (suivi : *Disparu* / *Mieux* / *Pareil* / *Pire*, + localisation / intensité /10 via « Autre » si présent).
6. **Semaine suivante** : planning (*Créneaux habituels* / *Changement* → détail via « Autre ») ; et une question libre *Autre chose à signaler ?* (*Non* / « Autre »).

Ensuite : récapituler en 3–5 lignes ce qui a été compris, puis dérouler les étapes 1–11 ci-dessous (remplir les blocs Notes de `prog/`, journal, adaptation). Une réponse manquante → `null` + note, jamais d’estimation.

## Traitement

1. Lire `athletes/current.yaml` → profil · la semaine concernée dans `prog/` · son entrée de journal + celle de la semaine précédente (règle des écarts, étape 8). Pas d’autres semaines ni de `methodology.md` sauf besoin précis.
2. Parser feedback (blocs **Notes / feedback**, un `###` par jour) : fait · charges / score · **Zone 2** (minutes + ergo, `non` si pas faite) · note ; RPE par mouvement souvent inline dans charges ; RPE séance et **mouvements + charges** du mercredi team ; fatigue / douleur dans note si mentionnées. Zone 2 absente du feedback → la demander avant d’écrire.
3. Pas de score douleur systématique. Si douleur → protocole profil / adapter volume.
4. Team WOD RPE ≥ seuil profil (défaut 8) → −volume J+1.
5. Adapter la suite sans casser l’intention du meso ; écrire bloc jour + **Synthèse semaine** / **Suite prévue**.
6. Semaine commencée/passée : Notes OK, contenu prescrit figé — adapter uniquement la suite.
7. **Journal** : reporter la semaine dans `athletes/<id>/journal/SXX-YYYY-MM-DD.yaml` (schéma `knowledge/journal-schema.yaml`) — jours (dont `z2_min` par jour), `realise` (doses effectives ; `z2_min` = somme fin de séance + séances dédiées), `team_wod_mouvements`, `familles_couvertes` (ids de `knowledge/movement-coverage.yaml`), `flags`, `ecarts_prescrit_vs_realise`, `gate`, synthèse. Chiffre absent du feedback → `null` + note, jamais d’estimation inventée.
8. **Écart prescrit / réalisé** : si le même mouvement sort deux semaines de suite dans le même sens (ex. barre systématiquement au-dessus du prescrit), la prescription est fausse — ré-ancrer les fourchettes dans le profil (`volumes.oly.load_anchoring`, `prs_current_kg`) et le signaler.
9. Récurrent/durable → profil (+ rule si process).
10. Fin de meso : vérifier `knowledge/meso-gates.yaml` avant meso suivant.
11. `npm run lint:prog` (inclut l’audit doses / boucle de feedback) puis confirmer brièvement ce qui change et pourquoi.
