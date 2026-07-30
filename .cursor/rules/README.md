# Rules Cursor — crossfit-prog

Architecture optimisée tokens **sans perte méthodo** : une rule légère toujours active, le reste activé par contexte (fichiers ouverts / référencés).

## Fichiers

| Rule | Scope | Contenu |
|------|-------|---------|
| `core.mdc` | **always** | Français, SoT (profil → prog → knowledge → books), lecture profil avant prog/feedback, décisions durables |
| `prog-writing.mdc` | `prog/**/*.md` | Structure, référentiel vs saisons, langage box, ops pack complet, pédagogie, planning, immutabilité, lint |
| `athlete-profile.mdc` | `athletes/**/*` | Champs profil, planning, persistance feedback récurrent |
| `knowledge-corpus.mdc` | `knowledge/**/*` | Méthodo validated, synthèse livres, arbitrages — pas de chargement massif `books/` |
| `svg-utf8.mdc` | `prog/public/**/*.svg` | UTF-8, XML, chemins sans collision VitePress |

## Skills projet (`.cursor/skills/`)

Chargés **à la demande** selon l’intention du chat. Ils renvoient vers les rules ci-dessus pour le détail rédactionnel ; ils gardent preconditions (YAML à lire) et workflow (steps).

| Skill | Usage typique |
|-------|----------------|
| `write-week` | Créer / mettre à jour une semaine |
| `session-feedback` | Feedback post-séance, Notes, suite |
| `generate-training-cycle` | Saison / macro / meso |
| `explain-programming` | Expliquer une séance ou semaine existante |
| `run-benchmarks` | Batterie tests, MAJ `prs_current_kg` |
| `answer-from-books` | Question théorique (knowledge d’abord) |
| `synthesize-methodology` | Fiches livre, méthodo draft |

## Indexation (`.cursorignore`)

`books/`, `knowledge/raw/`, caches et dépendances sont exclus de l’index Cursor. Corpus brut → lire **ciblé** via `knowledge/` ou extrait ponctuel.

## Habitudes tokens

1. **Nouveau chat par tâche** — évite d’empiler les lectures d’outils.
2. **Ask** pour questions / explications ; **Agent** pour éditer.
3. **Référencer un fichier** (`@S12-2026-….md`) plutôt qu’un dossier entier (`@prog/`).
4. Tâches lourdes par design : write-week, generate, synthèse livres — coût normal.

## Modifier les rules

- Règle **universelle** (langue, SoT) → `core.mdc` (rester concis).
- Règle **rédaction séances** → `prog-writing.mdc`.
- Règle **profil / planning durable** → `athlete-profile.mdc` ou profil athlète + `core.mdc`.
- Éviter `alwaysApply: true` sauf socle minimal ; préférer `globs` + `description` claire.

Après modification d’une rule ou d’une semaine : `npm run lint:prog`.
