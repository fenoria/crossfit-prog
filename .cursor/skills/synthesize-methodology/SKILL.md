---
name: synthesize-methodology
description: Analyse fine des ebooks dans books/, produit fiches livre et une méthodo CrossFit élite à valider. Use when synthesizing methodology, analyzing books, updating knowledge/methodology, or arbitrating between training authors.
---

# Synthesize methodology

## Goal
Extraire le **meilleur** et le **plus pertinent/récent** du corpus `books/` pour une méthodo CrossFit élite adaptée à `athlete/profile.yaml`. Pas de génération de séances.

## Steps
1. Lister les fichiers dans `books/`.
2. Pour chaque ouvrage, produire/mettre à jour `knowledge/books/<slug>.md` :
   - apports clés, limites, pertinence athlète, retenu vs écarté
3. Rédiger/mettre à jour :
   - `knowledge/arbitrages.md` — conflits auteurs + décision
   - `knowledge/methodology.md` — méthodo lisible (`draft` | `validated`)
   - `knowledge/methodology.yaml` (contrat machine, sync avec md)
   - Ops pack si impacté : `session-patterns`, `maintenance-doses`, `meso-gates`, `warmups`, `adductor-protocol`, `conditioning-matrix`, `volume-landmarks`, `gym-ladder`
4. Critères : pertinence CF, qualité, récence si divergence, box / 90 min / adducteur / gym volume.
5. **Validation humaine** avant d’écrire des semaines dans `prog/`.

## Roles indicatifs
- Structure : Issurin + Bompa · Dose : Israetel · Force spéciale : Verkhoshansky
- Haltéro : Everett · Gym : Low · Conditioning : matrix + Bible PP (gap Jamieson)
