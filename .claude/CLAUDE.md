# Socle crossfit-prog

## Langue
- Communiquer en **français** ; contenu `prog/`, méthodo, profil, skills et rules `.claude/` (descriptions comprises) en FR.
- OK : titres d’ouvrages EN, acronymes standards (EMOM, RPE, Z2…).

## SoT (ordre en conflit)
1. Profil actif : `athletes/current.yaml` → `athletes/<id>/profile.yaml`
2. `prog/` — séances exécutées
3. `knowledge/` — méthodo + ops pack (+ `methodology.md` **validated** pour générer)
4. `books/` — corpus brut ; **préférer `knowledge/`** ; ne pas citer contre méthodo validée sans `knowledge/arbitrages.md`

## Avant prog / feedback
Lire le profil actif : `level`, `priorities`, `strengths`, `weaknesses_or_limits`, `schedule`, `equipment`, `goal`, `injury`, `programming_rules`, `prs_current_kg` (jamais `prs_pre_injury_kg` pour les %), `volumes.*`, `gym_ladder_level`, `coaching.*`. Ne pas inventer créneau, matériel ni charges.

## Décisions durables
Contrainte planning, matériel, blessure, préférence méthodo, feedback récurrent → mettre à jour profil et/ou rules ; conflit auteurs → `knowledge/arbitrages.md`. Ne pas laisser la décision dans le chat seul.

## Rules & skills (`.claude/`)
- Rules scopées par `paths` (chargées quand un fichier correspondant est lu) : `prog-writing.md` (`prog/**/*.md`), `athlete-profile.md` (`athletes/**`), `knowledge-corpus.md` (`knowledge/**`), `svg-utf8.md` (`prog/public/**/*.svg`), `analytics.md` (dashboard `prog/analytics/`, thème, `scripts/build-analytics.py`).
- Skills : `write-week`, `session-feedback`, `generate-training-cycle`, `explain-programming`, `run-benchmarks`, `answer-from-books`, `synthesize-methodology`.
- Règle universelle → ce fichier (rester concis) ; rédaction séances → `prog-writing.md` ; profil / planning durable → `athlete-profile.md` ou profil athlète.
- `books/` et `knowledge/raw/` : lecture **ciblée** uniquement, jamais en masse. Archives (`*-archive.md`, `*-changelog.md`, `history.yaml`) : hors lecture par défaut.

Après modification d’une rule ou d’une semaine : `npm run lint:prog`. Après modification d’un journal : `npm run build:analytics` (dashboards `prog/analytics/`).
