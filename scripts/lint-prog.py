#!/usr/bin/env python3
"""Garde-fou cohérence prog/ — checks structurels (pas le contenu coaching)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROG = ROOT / "prog"
VP_CURRENT = ROOT / ".vitepress" / "current.json"
METHODO = ROOT / "knowledge" / "methodology.md"
METHODO_YAML = ROOT / "knowledge" / "methodology.yaml"
PATTERNS_FILE = ROOT / "knowledge" / "session-patterns.yaml"
WARMUPS_FILE = ROOT / "knowledge" / "warmups.yaml"
MAINTENANCE = ROOT / "knowledge" / "maintenance-doses.yaml"

PATTERN_IDS = {
    "force_lower",
    "force_upper",
    "gym_skill_day",
    "oly_power_day",
    "conditioning_z2",
    "conditioning_specific",
    "team_wod",
    "benchmark_session",
}

DAY_HEADINGS = re.compile(
    r"^## (Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche)\b",
    re.M,
)
DAY_BLOCKS = re.compile(
    r"^## (Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche)\b.*?(?=^## |\Z)",
    re.M | re.S,
)
FORBIDDEN = re.compile(
    r"squat\s+(snatch|clean).{0,40}(max\s*out|1\s*RM|PR\s*pré)",
    re.I,
)
BACKTICK_ID = re.compile(r"`([a-z][a-z0-9_]*)`")


def load_pattern_ids() -> set[str]:
    if not PATTERNS_FILE.exists():
        return PATTERN_IDS
    ids: set[str] = set()
    in_list = False
    for line in PATTERNS_FILE.read_text(encoding="utf-8").splitlines():
        if line.strip() == "pattern_ids:":
            in_list = True
            continue
        if in_list:
            if line.startswith("  - "):
                ids.add(line.strip()[2:].strip())
            elif line and not line.startswith(" "):
                break
    return ids or PATTERN_IDS


def load_warmup_ids() -> set[str]:
    ids: set[str] = set()
    if not WARMUPS_FILE.exists():
        return ids
    in_warmups = False
    for line in WARMUPS_FILE.read_text(encoding="utf-8").splitlines():
        if line.strip() == "warmups:":
            in_warmups = True
            continue
        if in_warmups and re.match(r"^  [a-z][a-z0-9_]*:", line):
            ids.add(line.strip().rstrip(":"))
        elif in_warmups and line and not line.startswith(" "):
            break
    return ids


def load_meso_codes() -> set[str]:
    codes = {
        "benchmarks",
        "ACC-GPP",
        "ACC-GYM",
        "ACC-STR",
        "ACC-OLY",
        "TRA-MIX",
        "TRA-POW",
        "REAL",
        "TRANS",
    }
    if not MAINTENANCE.exists():
        return codes
    text = MAINTENANCE.read_text(encoding="utf-8")
    for m in re.finditer(r"^  ([A-Z][A-Z0-9_-]+|benchmarks):", text, re.M):
        codes.add(m.group(1))
    return codes


def week_files() -> list[Path]:
    return sorted(p for p in PROG.rglob("S*.md") if p.name.startswith("S"))


def check_methodo(errors: list[str], warnings: list[str]) -> None:
    text = METHODO.read_text(encoding="utf-8")
    if "validated" not in text.lower():
        errors.append("methodology.md : statut validated introuvable")
    if METHODO_YAML.exists():
        ytext = METHODO_YAML.read_text(encoding="utf-8")
        if "status: validated" not in ytext:
            errors.append("methodology.yaml : status validated introuvable")
        if "REAL-mini" in ytext and "meso_code_aliases" not in ytext:
            warnings.append("methodology.yaml : REAL-mini sans aliases ?")


def check_current_json(errors: list[str]) -> None:
    if not VP_CURRENT.exists():
        errors.append(".vitepress/current.json manquant")
        return
    data = json.loads(VP_CURRENT.read_text(encoding="utf-8"))
    week = data.get("week") or data.get("path")
    if not week:
        errors.append("current.json : clé week/path manquante")
        return
    rel = str(week).lstrip("/")
    candidate = PROG / (rel if rel.endswith(".md") else f"{rel}.md")
    if not candidate.exists():
        errors.append(f"current.json pointe vers un fichier absent : {week}")


def extract_ids_after_label(block: str, label: str) -> list[str]:
    """Tous les `snake_case` sur les lignes **Label** : …"""
    ids: list[str] = []
    for line in block.splitlines():
        if re.match(rf"\*\*{label}\*\*\s*:", line, re.I):
            ids.extend(BACKTICK_ID.findall(line))
    return ids


def check_week(
    path: Path,
    pattern_ids: set[str],
    warmup_ids: set[str],
    errors: list[str],
    warnings: list[str],
) -> None:
    text = path.read_text(encoding="utf-8")
    rel = path.relative_to(ROOT)

    if "### Fondements" not in text and "## Fondements" not in text:
        errors.append(f"{rel} : section Fondements manquante")

    if "**Pourquoi**" not in text:
        warnings.append(f"{rel} : **Pourquoi** manquant")

    if "Notes / feedback" not in text and "## Notes" not in text:
        warnings.append(f"{rel} : section Notes / feedback absente")

    blocks = list(DAY_BLOCKS.finditer(text))
    if len(blocks) < 5:
        warnings.append(f"{rel} : moins de 5 jours nommés ({len(blocks)})")

    for m in blocks:
        day = m.group(1)
        block = m.group(0)
        # Dimanche off pur sans pattern OK
        patterns = extract_ids_after_label(block, "Pattern")
        warmups = extract_ids_after_label(block, "Warm-up")

        if day != "Dimanche" and not patterns:
            # Samedi OFF peut n’avoir que le libellé
            if day == "Samedi" and re.search(r"\bOFF\b", block, re.I):
                continue
            errors.append(f"{rel} : {day} sans champ Pattern")

        for pid in patterns:
            if pid not in pattern_ids:
                errors.append(f"{rel} : {day} pattern inconnu « {pid} »")

        if day in {"Lundi", "Mardi", "Jeudi", "Vendredi"} and not warmups:
            errors.append(f"{rel} : {day} sans Warm-up")

        if day in {"Mercredi", "Samedi"} and patterns and not warmups:
            # séance active attendue
            if day == "Samedi" and re.search(r"\bOFF\b", block, re.I):
                continue
            warnings.append(f"{rel} : {day} sans Warm-up (recommandé)")

        for wid in warmups:
            if warmup_ids and wid not in warmup_ids:
                errors.append(f"{rel} : {day} warmup inconnu « {wid} »")

    if FORBIDDEN.search(text):
        errors.append(f"{rel} : formulation squat snatch/clean max out / PR pré-blessure")


def check_meso_indexes(meso_codes: set[str], warnings: list[str]) -> None:
    for index in PROG.rglob("index.md"):
        if "meso-" not in str(index):
            continue
        text = index.read_text(encoding="utf-8")
        rel = index.relative_to(ROOT)
        m = re.search(r"\*\*Code\*\*\s*:\s*`?([A-Za-z0-9_-]+)`?", text)
        if m:
            code = m.group(1)
            if code not in meso_codes and code not in {"REAL-mini"}:
                warnings.append(f"{rel} : code meso « {code} » hors maintenance-doses")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    pattern_ids = load_pattern_ids()
    warmup_ids = load_warmup_ids()
    meso_codes = load_meso_codes()

    if not PROG.exists():
        print("ERREUR : prog/ introuvable", file=sys.stderr)
        return 2

    check_methodo(errors, warnings)
    check_current_json(errors)
    check_meso_indexes(meso_codes, warnings)

    weeks = week_files()
    if not weeks:
        warnings.append("aucune semaine S*.md sous prog/")
    for w in weeks:
        check_week(w, pattern_ids, warmup_ids, errors, warnings)

    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")

    print(f"— {len(weeks)} semaine(s), {len(warnings)} warning(s), {len(errors)} erreur(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
