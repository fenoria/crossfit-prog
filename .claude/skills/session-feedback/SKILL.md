---
name: session-feedback
description: Ingère le feedback post-séance ou hebdo, met à jour profil / prog, adapte la suite comme un coach. À utiliser quand l’athlète donne RPE, douleur, charges faites, reps manquées ou changement de planning après une séance, ou demande le feedback de la semaine (« feedback de la semaine », « on fait le feedback ») — dans ce cas, lancer le QCM interactif.
---

# Session feedback

Règles : **`.claude/rules/prog-writing.md`** (immutabilité, Bilan) · **`.claude/rules/athlete-profile.md`** (profil).

**Où écrire** : le réalisé jour par jour va **directement dans le journal** (`athletes/<id>/journal/SXX-YYYY-MM-DD.yaml`, SoT du réalisé). La semaine dans `prog/` ne reçoit que la section **`## Bilan`**, au feedback de fin de semaine. Un feedback en cours de semaine → journal seulement.

**Zone 2 de fin de séance — toujours demander, pour chaque séance faite** (feedback d’une séance ou de la semaine, QCM ou collé) : l’athlète en fait au gré du temps restant, elle n’est pas écrite dans la séance (`coaching.z2_end_of_session` du profil). Question dédiée par jour : *Pas faite* / *Faite* → minutes + ergo via « Autre ». Ne jamais la déduire d’un « fait comme prescrit », ni la fondre dans la question d’exécution. Les séances Zone 2 **dédiées** (samedi / dimanche, ou jour dont l’intention est la Z2) se demandent à part (étape 4).

## Mode QCM (feedback hebdo — systématique)

Quand l’athlète **demande** le feedback de la semaine (sans le coller déjà rédigé) : le recueillir **par QCM interactif** (`AskUserQuestion`), pas par question ouverte. Préférence durable : `coaching.feedback_mode` du profil.

Préparation : lire la semaine dans `prog/` (séances prescrites, fourchettes de charge, consignes « noter … »), son entrée de journal (`reperes` attendus, `a_verifier`, jours déjà renseignés) et l’entrée précédente (`flags`, écarts `re_ancrer` / `surveiller`). Les questions sont **construites depuis la prescription de la semaine**, jamais génériques : nommer la séance et les charges prescrites dans le libellé. Chaque `reperes` à `null` et chaque point `a_verifier` doit être couvert par une question (ou une réponse déjà donnée).

Contraintes outil : ≤ 4 questions par appel, 2–4 choix par question, « Autre » (texte libre) toujours dispo → l’utiliser pour les chiffres (charges, minutes, score). Enchaîner les tours ; ne poser un tour de détail que si une réponse l’exige.

Tours (ne garder que ce que la semaine contient) :
1. **Exécution, un jour = une question** (jours prescrits uniquement, 2 appels si > 4 jours). Libellé : `Mardi — BS 4×3 @ 115 / DL 3×3 @ 150 : ?` · choix : *Fait comme prescrit* / *Fait, charges ou volume modifiés* / *Partiel* / *Non fait*.
   - **Zone 2 de fin de séance, un jour = une question** (jours faits uniquement) : `Mardi — Zone 2 en fin de séance ?` · choix : *Pas faite* / *Faite* (minutes + ergo via « Autre »).
2. **Détail des écarts** — seulement pour les jours ≠ *comme prescrit* : quoi (mouvements sautés / charges réelles via « Autre ») et pourquoi (*Fatigue* / *Gêne-douleur* / *Temps* / *Choix*).
3. **Intensité ressentie** : position de la barre / force vs fourchettes (*En dessous* / *Dans la cible* / *Au-dessus, facile* / *Au-dessus, dur*), RPE upper et lower si séances de force (*≤ 6* / *7* / *8* / *9+*), **RPE team WOD** (*≤ 6* / *7* / *8* / *9+* — ≥ seuil profil ⇒ étape 4).
4. **Team WOD + volumes non chronométrés** : mouvements + charges du WOD team (« Autre », exigé par `team_wod_log_movements`) ; Zone 2 de la séance dédiée (*Comme prescrit* / *Moins* / *Plus* / *Pas faite*, minutes via « Autre ») ; total Z2 de la semaine (fin de séance + dédiée) vs plancher profil ; réathlé / accessoires prescrits faits ? (*Oui* / *En partie* / *Non*).
5. **Récup & signaux MRV** (choix multiples) : *Rien à signaler* / *Sommeil dégradé* / *Fatigue générale / perf en baisse* / *Gêne ou douleur*. Douleur : ne **pas** interroger par défaut (règle profil) — on ne détaille que si l’athlète coche *Gêne ou douleur*, ou si un flag douleur est **ouvert dans le journal précédent** (suivi : *Disparu* / *Mieux* / *Pareil* / *Pire*, + localisation / intensité /10 via « Autre » si présent).
6. **Semaine suivante** : planning (*Créneaux habituels* / *Changement* → détail via « Autre ») ; et une question libre *Autre chose à signaler ?* (*Non* / « Autre »).

Ensuite : récapituler en 3–5 lignes ce qui a été compris, puis dérouler les étapes 1–11 ci-dessous (journal, Bilan dans `prog/`, adaptation). Une réponse manquante → `null` + note, jamais d’estimation.

## Traitement

1. Lire `athletes/current.yaml` → profil · la semaine concernée dans `prog/` · son entrée de journal + celle de la semaine précédente (règle des écarts, étape 8). Pas d’autres semaines ni de `methodology.md` sauf besoin précis.
2. Extraire du feedback (QCM ou texte collé), par jour : fait · charges / score · **Zone 2** (minutes + ergo, `0` si pas faite) · note ; RPE par mouvement inline dans charges ; RPE séance et **mouvements + charges** du mercredi team ; fatigue / douleur dans note si mentionnées. Zone 2 absente du feedback → la demander avant d’écrire.
3. Pas de score douleur systématique. Si douleur → protocole profil / adapter volume.
4. Team WOD RPE ≥ seuil profil (défaut 8) → −volume J+1.
5. Adapter la suite sans casser l’intention du meso.
6. Semaine commencée/passée : contenu prescrit figé — adapter uniquement la suite (semaines futures).
7. **Journal** (SoT du réalisé, schéma `knowledge/journal-schema.yaml`) : `jours` (dont `z2_min` par jour), `realise` (doses effectives ; `z2_min` = somme fin de séance + séances dédiées), `team_wod_mouvements`, `familles_couvertes` (ids de `knowledge/movement-coverage.yaml`), `reperes` (remplir les `null`), **`series`** (charge de travail la plus haute par mouvement clé : `{ mvt, kg, serie, rpe, type, note }`, une ligne par mouvement, conventions RPE du schéma) et **`signaux`** (épaule / adducteur / mains, niveau 0–3, pire niveau de la semaine) — `crans` (échelle gym : seulement si un cran est mesuré, validé, suspendu ou repris, cohérent avec `gym_ladder_level` du profil) ; ces champs alimentent les dashboards `prog/analytics/`, les renseigner à chaque feedback, même partiel (lignes ajoutées au fil des jours) ; `flags`, `ecarts_prescrit_vs_realise`, `gate`, `synthese`, `suite` ; `statut` → `en_cours` puis `close`. Chiffre absent du feedback → `null` + note, jamais d’estimation inventée.
   - **Fin de semaine — section `## Bilan`** en fin de la semaine `prog/` (après un `---`) : **Synthèse semaine** (4–6 phrases, récit lisible pour l’athlète : ce qui est passé, chiffres clés, signaux) · **Repères** (liste, seulement si la semaine en relevait) · **Suite prévue** (ce qui change la semaine suivante et pourquoi). Langage visible de `prog-writing.md` : pas de chemins ni de champs internes, écrire ce qu’on fait (pas « sorti du plan »).
8. **Écart prescrit / réalisé** : si le même mouvement sort deux semaines de suite dans le même sens (ex. barre systématiquement au-dessus du prescrit), la prescription est fausse — ré-ancrer les fourchettes dans le profil (`volumes.oly.load_anchoring`, `prs_current_kg`) et le signaler.
9. Récurrent/durable → profil (+ rule si process).
10. Fin de meso : vérifier `knowledge/meso-gates.yaml` avant meso suivant.
11. **Analytics** : `npm run build:analytics` (régénère `.vitepress/theme/analytics/data.json` depuis le journal ; le fichier se commite avec le journal). Au feedback de **fin de semaine** seulement, relire `athletes/<id>/constats.yaml` (lede, `etat`, six constats) et le mettre à jour d'après le journal : texte rédigé, jamais de chiffre absent du journal ; `updated` = date du jour.
12. `npm run lint:prog` (inclut l’audit doses / boucle de feedback) puis confirmer brièvement ce qui change et pourquoi.
