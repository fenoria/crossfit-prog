---
name: write-week
description: Écrit ou met à jour une semaine d’entraînement en Markdown sous prog/ (Saison→Macro→Meso→Semaine). Use when creating a training week, mesocycle, macrocycle, or updating the program site content.
---

# Write week (prog/)

## Source de vérité
[`prog/`](prog/) — hiérarchie Saison → Macrocycle → Meso → Semaine.  
Sidebar VitePress = **auto** (arborescence `prog/`).

## Preconditions
- `knowledge/methodology.md` status **validated**
- Lire `athlete/profile.yaml` + dernières semaines du même meso

## Steps
1. Assurer les `index.md` Saison / Macro / Meso si absents (intention + lien temporel).
2. Créer/mettre à jour `Sxx-YYYY-MM-DD.md` avec :
   - Pourquoi / intention / apport / place dans le meso
   - Jours Lun–Ven (≤90 min), Mercredi team ou Z2, Samedi si ON, Dimanche off/Z2
   - Notes athlète
3. Mettre à jour l’index du meso (liste des semaines).
4. Mettre à jour [`.vitepress/current.json`](.vitepress/current.json) (`week` + `label`) pour le lien nav « En cours ».
5. Entrée courte dans `history/decisions.md` si arbitrage.
