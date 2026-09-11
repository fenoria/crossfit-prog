#!/usr/bin/env python3
"""Audit des doses hebdomadaires — vérifie ce que l'ops pack se contente de déclarer.

lint-prog.py contrôle la FORME des semaines (patterns, warm-ups, fuites internes).
Ce module contrôle le FOND mesurable :

- volumes hebdo vs bornes MEV / MRV du profil athlète
- doses de maintien minimales du code meso (maintenance-doses.yaml)
- caps energy systems (conditioning-matrix.yaml)
- boucle de feedback : semaine passée sans Notes remplies ni entrée de journal
- écart prescrit / réalisé répété : la prescription est fausse, pas l'athlète

Chaque semaine déclare ses doses en commentaire HTML (invisible sur le site) :

    <!-- meso: ACC-STR -->
    <!-- dose: force_lower_sets=11 force_upper_sets=8 force_sessions=3 ... -->
    <!-- dose-note: texte libre expliquant une exemption -->

Les semaines antérieures au déploiement des balises (voir DOSE_TAGS_FROM) sont ignorées.
"""

from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import miniyaml  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
PROG = ROOT / "prog"
KNOWLEDGE = ROOT / "knowledge"
ATHLETES = ROOT / "athletes"

# Balises dose déployées à partir de Macro 2 (S08) — avant, feedback en prose seulement.
DOSE_TAGS_FROM = date(2026, 9, 21)

MESO_TAG = re.compile(r"<!--\s*meso:\s*([A-Za-z0-9_-]+)\s*-->")
DOSE_TAG = re.compile(r"<!--\s*dose:\s*(.*?)-->", re.S)
WEEK_DATE = re.compile(r"^S(\d+)-(\d{4})-(\d{2})-(\d{2})\.md$")

INT_FIELDS = {
    "force_lower_sets",
    "force_upper_sets",
    "force_sessions",
    "oly_lifts",
    "oly_sessions",
    "gym_min",
    "gym_sessions",
    "z2_min",
    "hard_min",
    "hard_sessions",
    "team_sessions",
    "threshold_min",
    "threshold_sessions",
    "alactic_sec",
    "alactic_sessions",
}
TEXT_FIELDS = {"exempt"}

# champ de dose → domaine de profile.volumes
VOLUME_MAP = {
    "gym_min": "gym",
    "force_lower_sets": "force_lower",
    "force_upper_sets": "force_upper",
    "oly_lifts": "oly",
    "z2_min": "z2",
}
# dominant déclaré dans maintenance-doses → champs de dose concernés
DOMINANT_FIELDS = {
    "gym": ["gym_min"],
    "force": ["force_lower_sets", "force_upper_sets"],
    "oly": ["oly_lifts"],
    "power": ["oly_lifts"],
}
# champ de dose → clé d'exemption
EXEMPT_KEY = {
    "gym_min": "gym",
    "gym_sessions": "gym",
    "force_lower_sets": "force",
    "force_upper_sets": "force",
    "force_sessions": "force",
    "oly_lifts": "oly",
    "oly_sessions": "oly",
    "z2_min": "z2",
    "hard_min": "hard",
    "hard_sessions": "hard",
    "threshold_min": "threshold",
    "threshold_sessions": "threshold",
    "alactic_sec": "alactic",
    "alactic_sessions": "alactic",
}


def _range_max(value) -> int | None:
    """« 12–25 » → 25 ; 30 → 30."""
    if value is None:
        return None
    if isinstance(value, int):
        return value
    numbers = re.findall(r"\d+", str(value))
    return int(numbers[-1]) if numbers else None


def active_profile() -> dict:
    current = miniyaml.load(ATHLETES / "current.yaml") or {}
    athlete = current.get("id", "")
    return miniyaml.load(ATHLETES / athlete / "profile.yaml") or {}


def week_date(path: Path) -> date | None:
    m = WEEK_DATE.match(path.name)
    if not m:
        return None
    return date(int(m.group(2)), int(m.group(3)), int(m.group(4)))


def parse_dose(text: str, rel: str, errors: list[str]) -> tuple[dict, set[str]] | None:
    match = DOSE_TAG.search(text)
    if not match:
        return None
    values: dict[str, int] = {}
    exempt: set[str] = set()
    for token in match.group(1).split():
        if "=" not in token:
            errors.append(f"{rel} : balise dose — jeton « {token} » sans « = »")
            continue
        key, raw = token.split("=", 1)
        if key in TEXT_FIELDS:
            if key == "exempt":
                exempt |= {part for part in raw.split(",") if part}
            continue
        if key not in INT_FIELDS:
            errors.append(f"{rel} : balise dose — champ inconnu « {key} »")
            continue
        if not re.fullmatch(r"\d+", raw):
            errors.append(f"{rel} : balise dose — « {key}={raw} » n'est pas un entier")
            continue
        values[key] = int(raw)
    unknown = exempt - set(EXEMPT_KEY.values())
    for item in sorted(unknown):
        errors.append(f"{rel} : balise dose — exemption inconnue « {item} »")
    return values, exempt


def check_volumes(
    rel: str,
    dose: dict,
    exempt: set[str],
    volumes: dict,
    dominant: str | None,
    errors: list[str],
    warnings: list[str],
) -> None:
    dominant_fields = DOMINANT_FIELDS.get(dominant or "", [])
    for field, domain in VOLUME_MAP.items():
        if field not in dose or EXEMPT_KEY[field] in exempt:
            continue
        bounds = volumes.get(domain) or {}
        value = dose[field]
        mrv = bounds.get("mrv")
        mev = bounds.get("mev")
        if isinstance(mrv, int) and value > mrv:
            errors.append(f"{rel} : {domain} {value} > MRV {mrv} (profil)")
        if isinstance(mev, int) and value < mev:
            if domain == "z2" or field in dominant_fields:
                warnings.append(f"{rel} : {domain} {value} < MEV {mev} (profil)")


def check_maintenance(
    rel: str,
    dose: dict,
    exempt: set[str],
    meso_doses: dict,
    errors: list[str],
    warnings: list[str],
) -> None:
    checks = [
        ("gym", "min_per_week", "gym_sessions", "séance(s) gym"),
        ("force", "min_per_week", "force_sessions", "séance(s) force"),
        ("oly", "min_per_week", "oly_sessions", "séance(s) barre"),
    ]
    for domain, key, field, label in checks:
        spec = meso_doses.get(domain)
        if not isinstance(spec, dict) or field not in dose:
            continue
        if EXEMPT_KEY[field] in exempt:
            continue
        minimum = spec.get(key)
        if isinstance(minimum, int) and dose[field] < minimum:
            warnings.append(
                f"{rel} : maintien — {dose[field]} {label} pour {minimum} requise(s)"
            )

    z2_spec = meso_doses.get("z2")
    if isinstance(z2_spec, dict) and "z2_min" in dose and "z2" not in exempt:
        minimum = z2_spec.get("min_minutes_week")
        if isinstance(minimum, int) and dose["z2_min"] < minimum:
            warnings.append(
                f"{rel} : maintien — Zone 2 {dose['z2_min']} min pour {minimum} min requises"
            )

    hi_spec = meso_doses.get("cond_hi")
    if isinstance(hi_spec, dict) and "hard_sessions" in dose and "hard" not in exempt:
        maximum = hi_spec.get("max_per_week")
        if isinstance(maximum, int) and dose["hard_sessions"] > maximum:
            errors.append(
                f"{rel} : {dose['hard_sessions']} effort(s) dur(s) programmé(s) "
                f"pour un maximum de {maximum} sur ce type de meso"
            )


def check_conditioning(
    rel: str,
    dose: dict,
    exempt: set[str],
    systems: dict,
    errors: list[str],
    warnings: list[str],
) -> None:
    glyco = (systems.get("glycolytic") or {}).get("dose_cap") or {}
    sessions = dose.get("hard_sessions", 0) + dose.get("team_sessions", 0)
    cap_sessions = _range_max(glyco.get("sessions_per_week_max"))
    if cap_sessions and sessions > cap_sessions and "hard" not in exempt:
        warnings.append(
            f"{rel} : {sessions} séances dures (team compris) pour un cap de {cap_sessions}"
        )
    cap_minutes = _range_max(glyco.get("hard_minutes_week_max"))
    if cap_minutes and dose.get("hard_min", 0) > cap_minutes and "hard" not in exempt:
        errors.append(
            f"{rel} : {dose['hard_min']} min d'effort dur programmées "
            f"pour un cap de {cap_minutes} min"
        )

    tempo = (systems.get("tempo_threshold") or {}).get("dose_cap") or {}
    cap_tempo = _range_max(tempo.get("sessions_per_week_max"))
    if cap_tempo and dose.get("threshold_sessions", 0) > cap_tempo:
        warnings.append(
            f"{rel} : {dose['threshold_sessions']} blocs seuil pour un cap de {cap_tempo}"
        )
    cap_tempo_min = _range_max(tempo.get("work_min"))
    if cap_tempo_min and dose.get("threshold_min", 0) > cap_tempo_min:
        warnings.append(
            f"{rel} : bloc seuil {dose['threshold_min']} min > {cap_tempo_min} min"
        )

    alactic = (systems.get("alactic_power") or {}).get("dose_cap") or {}
    cap_alactic = _range_max(alactic.get("sessions_per_week_max"))
    if cap_alactic and dose.get("alactic_sessions", 0) > cap_alactic:
        warnings.append(
            f"{rel} : {dose['alactic_sessions']} blocs alactiques pour un cap de {cap_alactic}"
        )
    cap_sec = _range_max(alactic.get("total_work_sec_week"))
    if cap_sec and dose.get("alactic_sec", 0) > cap_sec:
        warnings.append(f"{rel} : {dose['alactic_sec']} s alactiques > {cap_sec} s")


def check_feedback_loop(
    path: Path,
    rel: str,
    text: str,
    journal_dir: Path,
    today: date,
    warnings: list[str],
) -> None:
    start = week_date(path)
    if start is None:
        return
    from datetime import timedelta

    if start + timedelta(days=6) >= today:
        return  # semaine en cours ou à venir
    entry = journal_dir / f"{path.stem}.yaml"
    if not entry.exists():
        warnings.append(f"{rel} : semaine passée sans entrée de journal ({entry.name})")
    notes = text.split("## Notes", 1)[-1]
    filled = [
        line
        for line in re.findall(r"^-\s+\*\*Fait\*\*\s*:\s*(.*)$", notes, re.M)
        if line.strip() and "/" not in line.strip()
    ]
    if not filled:
        warnings.append(f"{rel} : semaine passée sans feedback rempli (blocs Notes vides)")


def check_ecarts(journal_dir: Path, warnings: list[str]) -> None:
    """Même mouvement, même sens, deux semaines : la prescription est à ré-ancrer."""
    if not journal_dir.is_dir():
        return
    seen: dict[tuple[str, str], list[tuple[str, str]]] = {}
    for entry in sorted(journal_dir.glob("S*.yaml")):
        data = miniyaml.load(entry) or {}
        for item in data.get("ecarts_prescrit_vs_realise") or []:
            if not isinstance(item, dict):
                continue
            key = (str(item.get("mouvement")), str(item.get("sens")))
            seen.setdefault(key, []).append(
                (str(data.get("semaine") or entry.stem), str(item.get("action") or ""))
            )
    for (mouvement, sens), occurrences in sorted(seen.items()):
        if len(occurrences) < 2:
            continue
        if occurrences[-1][1] == "re_ancrer":
            continue  # écart déjà traité par un ré-ancrage
        semaines = ", ".join(week for week, _ in occurrences)
        warnings.append(
            f"journal : « {mouvement} » {sens} du prescrit sur {len(occurrences)} semaines "
            f"({semaines}) — ré-ancrer la prescription"
        )


def run_audit(today: date | None = None) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    today = today or date.today()

    profile = active_profile()
    volumes = profile.get("volumes") or {}
    journal_dir = ROOT / (profile.get("journal_dir") or "").rstrip("/")
    maintenance = (miniyaml.load(KNOWLEDGE / "maintenance-doses.yaml") or {}).get(
        "by_meso_type"
    ) or {}
    systems = (miniyaml.load(KNOWLEDGE / "conditioning-matrix.yaml") or {}).get(
        "systems"
    ) or {}

    z2_streak: list[str] = []
    z2_mev = ((volumes.get("z2") or {}).get("mev")) or 0

    for path in sorted(PROG.rglob("S*.md")):
        start = week_date(path)
        if start is None:
            continue
        rel = str(path.relative_to(ROOT))
        text = path.read_text(encoding="utf-8")
        check_feedback_loop(path, rel, text, journal_dir, today, warnings)

        if start < DOSE_TAGS_FROM:
            continue

        meso_match = MESO_TAG.search(text)
        parsed = parse_dose(text, rel, errors)
        if not meso_match or parsed is None:
            errors.append(f"{rel} : balises <!-- meso: … --> / <!-- dose: … --> manquantes")
            continue
        meso = meso_match.group(1)
        dose, exempt = parsed
        meso_doses = maintenance.get(meso)
        if meso_doses is None:
            errors.append(f"{rel} : code meso « {meso} » absent de maintenance-doses")
            meso_doses = {}

        check_volumes(
            rel, dose, exempt, volumes, meso_doses.get("dominant"), errors, warnings
        )
        check_maintenance(rel, dose, exempt, meso_doses, errors, warnings)
        check_conditioning(rel, dose, exempt, systems, errors, warnings)

        if "z2_min" in dose and "z2" not in exempt and z2_mev:
            if dose["z2_min"] < z2_mev:
                z2_streak.append(path.stem.split("-")[0])
                if len(z2_streak) >= 3:
                    errors.append(
                        "Zone 2 sous le MEV sur 3 semaines consécutives "
                        f"({', '.join(z2_streak)}) — détraining aérobie"
                    )
            else:
                z2_streak = []

    check_ecarts(journal_dir, warnings)
    return errors, warnings


def main() -> int:
    errors, warnings = run_audit()
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    print(f"— audit : {len(warnings)} warning(s), {len(errors)} erreur(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
