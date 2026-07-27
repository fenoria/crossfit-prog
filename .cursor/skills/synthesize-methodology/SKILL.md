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
   - apports clés (périodisation, volume, force, Oly, gym, conditioning, mental)
   - limites / ce qui est daté ou peu applicable CrossFit box
   - pertinence pour cet athlète
   - **retenu** vs **écarté**
3. Rédiger/mettre à jour :
   - `knowledge/arbitrages.md` — conflits entre auteurs + décision
   - `knowledge/methodology.md` — méthodo lisible (statut: `draft` | `validated`)
   - `knowledge/methodology.yaml` + `knowledge/session-patterns.yaml`
4. Critères : pertinence CF compétition, qualité, récence si divergence, applicabilité (box, 90 min, adducteur, gym volume).
5. S’arrêter pour **validation humaine** avant d’écrire des semaines dans `prog/`.

## Roles indicatifs
- Structure cycle : Issurin + Bompa
- Dose volume/intensité : Israetel (+ Zatsiorsky)
- Force spéciale : Verkhoshansky
- Haltéro : Everett · Gym : Low
- Conditioning : Bible PP / Bompa (Jamieson absent — gap dans arbitrages)
- Socle FR/mental : encyclopédies (complément)
