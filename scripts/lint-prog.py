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
PATTERNS_FILE = ROOT / "knowledge" / "session-patterns.yaml"

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
FORBIDDEN = re.compile(
    r"squat\s+(snatch|clean).{0,40}(max\s*out|1\s*RM|PR\s*pré)",
    re.I,
)


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


def week_files() -> list[Path]:
    return sorted(PROG.rglob("S*.md"))


def check_methodo(errors: list[str]) -> None:
    text = METHODO.read_text(encoding="utf-8")
    if "validated" not in text.lower():
        errors.append("methodology.md : statut validated introuvable")


def check_current_json(errors: list[str]) -> None:
    if not VP_CURRENT.exists():
        errors.append(".vitepress/current.json manquant")
        return
    data = json.loads(VP_CURRENT.read_text(encoding="utf-8"))
    week = data.get("week") or data.get("path")
    if not week:
        errors.append("current.json : clé week/path manquante")
        return
    # week may be URL path like /saison-2026/.../S01-...
    rel = str(week).lstrip("/")
    if rel.endswith(".md"):
        candidate = PROG / rel
    else:
        candidate = PROG / f"{rel}.md"
    # also try under prog if path already includes saison
    if not candidate.exists():
        # VitePress paths often omit prog/ prefix
        alt = ROOT / "prog" / rel
        if not alt.suffix:
            alt = alt.with_suffix(".md")
        candidate = alt
    if not candidate.exists():
        errors.append(f"current.json pointe vers un fichier absent : {week}")


def check_week(path: Path, pattern_ids: set[str], errors: list[str], warnings: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    rel = path.relative_to(ROOT)

    if "### Fondements" not in text and "## Fondements" not in text:
        errors.append(f"{rel} : section Fondements manquante")

    if "**Pourquoi**" not in text:
        warnings.append(f"{rel} : **Pourquoi** manquant")

    if "Notes / feedback" not in text and "## Notes" not in text:
        warnings.append(f"{rel} : section Notes / feedback absente")

    days = DAY_HEADINGS.findall(text)
    if len(days) < 5:
        warnings.append(f"{rel} : moins de 5 jours nommés ({len(days)})")

    # Pattern lines (optional on Dimanche)
    pattern_lines = re.findall(r"\*\*Pattern\*\*\s*:\s*`?([a-z0-9_| ]+)`?", text, re.I)
    if days and not pattern_lines:
        warnings.append(f"{rel} : aucun champ Pattern: (template ops)")

    for raw in pattern_lines:
        for part in re.split(r"[|/]", raw):
            pid = part.strip().strip("`")
            if not pid or pid in ("…", "..."):
                continue
            # allow "benchmark_session (+ lower)" style
            pid = pid.split()[0] if pid.split() else pid
            if pid not in pattern_ids and pid not in {"warmup"}:
                # tolerate descriptive suffixes already stripped
                if pid not in pattern_ids:
                    warnings.append(f"{rel} : pattern inconnu « {pid} »")

    if FORBIDDEN.search(text):
        errors.append(f"{rel} : formulation squat snatch/clean max out / PR pré-blessure")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    pattern_ids = load_pattern_ids()

    if not PROG.exists():
        print("ERREUR : prog/ introuvable", file=sys.stderr)
        return 2

    check_methodo(errors)
    check_current_json(errors)

    weeks = week_files()
    if not weeks:
        warnings.append("aucune semaine S*.md sous prog/")
    for w in weeks:
        check_week(w, pattern_ids, errors, warnings)

    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")

    print(f"— {len(weeks)} semaine(s), {len(warnings)} warning(s), {len(errors)} erreur(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
