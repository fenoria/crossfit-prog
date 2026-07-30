---
name: synthesize-methodology
description: Analyse fine des ebooks dans books/, produit fiches livre et une méthodo CrossFit élite à valider. Use when synthesizing methodology, analyzing books, updating knowledge/methodology, or arbitrating between training authors.
---

# Synthesize methodology

Règles : **`.cursor/rules/knowledge-corpus.mdc`**.

Extraire le meilleur du corpus pour une méthodo CrossFit élite adaptée au profil actif. **Pas** de génération de séances.

## Steps
1. Lister `books/` ; traiter **ouvrage par ouvrage** (pas de chargement massif parallèle).
2. Pour chaque ouvrage → `knowledge/books/<slug>.md` (concepts, applications, limites).
3. Conflits → `knowledge/arbitrages.md`.
4. Synthèse globale → `knowledge/methodology.md` (statut **draft** jusqu’à validation athlète).
5. Fiches `prog/livres/*.md` si publication site (rule prog-writing pour le gabarit).
