# Instances athlètes

| Fichier | Rôle |
|---|---|
| [`current.yaml`](current.yaml) | Athlète actif (`id`) pour skills / rules Cursor |
| `<id>/profile.yaml` | Instance (charges, volumes, douleur, planning, compet) |

Résolution : lire `current.yaml` → `athletes/<id>/profile.yaml`.

- **SoT instance** = profil de l’athlète actif (gagne sur knowledge pour chiffres / planning).
- **Séances** = toujours sous `prog/` (site inchangé pour l’instant).
- Nouveau athlète = nouveau dossier `athletes/<id>/` + bascule de `current.yaml`.
