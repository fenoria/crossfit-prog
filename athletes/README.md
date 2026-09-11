# Instances athlètes

| Fichier | Rôle |
|---|---|
| [`current.yaml`](current.yaml) | Athlète actif (`id`) pour skills / rules Cursor |
| `<id>/profile.yaml` | État courant (charges, volumes, crans, douleur, planning, compet) |
| `<id>/journal/SXX-YYYY-MM-DD.yaml` | Historique semaine par semaine (schéma : `knowledge/journal-schema.yaml`) |

Résolution : lire `current.yaml` → `athletes/<id>/profile.yaml`.

- **SoT instance** = profil de l’athlète actif (gagne sur knowledge pour chiffres / planning).
- **Profil = présent, journal = passé** : pas de bloc d’historique dans le profil.
- **Séances** = toujours sous `prog/` (site inchangé pour l’instant).
- Nouveau athlète = nouveau dossier `athletes/<id>/` + bascule de `current.yaml`.
