#!/usr/bin/env python3
"""Génère les données des dashboards prog/analytics/ depuis le journal.

Entrées  : athletes/<id>/journal/S*.yaml (SoT du réalisé, schéma v3), profile.yaml,
           knowledge/instances/saison-*.yaml (calendrier), athletes/<id>/constats.yaml (texte).
Sortie   : .vitepress/theme/analytics/data.json (lu par les composants An*.vue).

Aucun chiffre n'est inventé : champ absent ou null = point absent du graphe.
Usage    : npm run build:analytics
"""

from __future__ import annotations

import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
import miniyaml  # noqa: E402

OUT = ROOT / ".vitepress" / "theme" / "analytics" / "data.json"

MESO_LABELS = {
    "benchmarks": "Benchmarks",
    "ACC-GYM": "Accumulation gym",
    "REAL": "Expression Fire",
    "TRANS": "Transition",
    "ACC-STR": "Accumulation force",
    "TRA-POW": "Conversion puissance",
    "TRA-MIX": "Conversion mixed",
}
PHASES = [
    {"id": "m1", "label": "Macro 1 · Build → Fire", "color": "s1"},
    {"id": "m2", "label": "Macro 2 · Élévation", "color": "s2"},
    {"id": "m3", "label": "Macro 3 · Accumulation gym", "color": "s3"},
    {"id": "tr", "label": "Transition", "color": "s5"},
    {"id": "op", "label": "Prépa Open · Open", "color": "s4"},
]
MACRO_PHASE = {"macro_1_build": "m1", "macro_2_elevation": "m2", "macro_3_accumulation_gym": "m3"}

# Mouvements suivis : (id, libellé, clé du profil pour la référence pré-blessure ou None)
LIFTS = [
    ("back_squat", "Back squat", "back_squat"),
    ("front_squat", "Front squat", "front_squat"),
    ("deadlift", "Soulevé de terre", "deadlift"),
    ("romanian_deadlift", "Soulevé de terre roumain", None),
    ("strict_press", "Strict press", None),
    ("weighted_pullup", "Traction lestée", None),
    ("power_snatch", "Arraché puissance", None),
    ("power_clean", "Épaulé puissance", None),
    ("snatch_pull", "Tirage arraché", None),
]
VOLUMES = [
    ("force_lower_sets", "Force bas du corps", "séries dures", "force_lower"),
    ("force_upper_sets", "Force haut du corps", "séries dures", "force_upper"),
    ("oly_lifts", "Haltéro", "levées de qualité", "oly"),
    ("z2_min", "Zone 2", "minutes", "z2"),
]
ZONES = [("epaule", "Épaule"), ("adducteur", "Adducteur"), ("mains", "Mains")]


def d(s: str) -> date:
    return date.fromisoformat(str(s)[:10])


def num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def active_athlete() -> str:
    return (miniyaml.load(ROOT / "athletes" / "current.yaml") or {}).get("id", "")


def load_instance() -> dict:
    for f in sorted((ROOT / "knowledge" / "instances").glob("saison-*.yaml")):
        data = miniyaml.load(f) or {}
        if data.get("status") == "active":
            return data
    raise SystemExit("aucune instance de saison active dans knowledge/instances/")


def build_weeks(instance: dict, journals: dict[int, dict], today: date) -> list[dict]:
    macros = instance.get("macrocycles") or {}
    start = d(macros["macro_1_build"]["fenetre"].split("→")[0].strip())
    trans_end = d(macros["transition"]["fenetre"].split("→")[1].strip())
    open_week = [d(w["fait_box"]) for w in instance["echeance_suivante"]["workouts"]]
    open_start = open_week[0] - timedelta(days=open_week[0].weekday())
    open_end = open_start + timedelta(weeks=len({x - timedelta(days=x.weekday()) for x in open_week}))

    meso_of: dict[str, tuple[str, str]] = {}
    for key, macro in macros.items():
        for code, sems in (macro.get("mesos") or {}).items():
            for s in sems:
                meso_of[s] = (key, code)

    n_weeks = ((open_end - start).days) // 7
    weeks = []
    for i in range(n_weeks):
        n = i + 1
        sid = f"S{n:02d}"
        monday = start + timedelta(weeks=i)
        if sid in meso_of:
            key, code = meso_of[sid]
            phase, meso = MACRO_PHASE.get(key, "tr"), MESO_LABELS.get(code, code)
            if key == "macro_1_build" and code == "TRANS":
                meso = "Transition mini"
        elif monday <= trans_end:
            phase, meso = "tr", "Décharge fin d'année"
        elif monday < open_start:
            phase, meso = "op", "Prépa Open"
        else:
            phase, meso = "op", "Open"
        j = journals.get(n, {})
        statut = j.get("statut")
        current = monday <= today < monday + timedelta(days=7)
        weeks.append({
            "n": n, "id": sid, "start": monday.isoformat(),
            "phase": phase, "meso": meso,
            "phase_micro": j.get("phase_micro"),
            "done": statut == "close",
            "current": current,
        })
    return weeks


def main() -> int:
    athlete = active_athlete()
    adir = ROOT / "athletes" / athlete
    profile = miniyaml.load(adir / "profile.yaml") or {}
    instance = load_instance()
    today = date.today()

    journals: dict[int, dict] = {}
    for f in sorted((adir / "journal").glob("S*.yaml")):
        data = miniyaml.load(f) or {}
        try:
            journals[int(f.name[1:3])] = data
        except ValueError:
            continue

    weeks = build_weeks(instance, journals, today)
    # Index de la dernière semaine qui a un réalisé (fait ou en cours)
    with_data = [w["n"] for w in weeks if w["done"] or (w["current"] and journals.get(w["n"], {}).get("series"))]
    last = max(with_data) if with_data else 1

    # ── charges ────────────────────────────────────────────────
    pre = profile.get("prs_pre_injury_kg") or {}
    lifts = []
    for mvt, label, pre_key in LIFTS:
        points = []
        for n in sorted(journals):
            if n > last:
                continue
            for row in journals[n].get("series") or []:
                if row.get("mvt") == mvt and num(row.get("kg")) is not None:
                    points.append({
                        "w": n - 1, "kg": row["kg"], "rpe": num(row.get("rpe")),
                        "type": row.get("type", "travail"), "serie": row.get("serie") or "",
                        "note": row.get("note") or "",
                    })
        if len({p["w"] for p in points}) < 2:
            continue
        lifts.append({"id": mvt, "label": label, "pre": num(pre.get(pre_key)) if pre_key else None, "points": points})

    # ── volumes ────────────────────────────────────────────────
    vol_profile = profile.get("volumes") or {}
    volumes = []
    for field, label, unit, key in VOLUMES:
        lm = vol_profile.get(key) or {}
        values, notes = [], []
        for n in range(1, last + 1):
            r = (journals.get(n) or {}).get("realise") or {}
            values.append(num(r.get(field)))
            notes.append(r.get(field + "_note") or r.get("z2_note" if field == "z2_min" else "") or "")
        volumes.append({
            "id": field, "label": label, "unit": unit,
            "mev": num(lm.get("mev")), "mrv": num(lm.get("mrv")),
            "values": values, "notes": notes,
        })

    # ── écarts prescrit / réalisé ──────────────────────────────
    deviations = []
    for n in range(1, last + 1):
        up, down, other = [], [], []
        for e in (journals.get(n) or {}).get("ecarts_prescrit_vs_realise") or []:
            txt = f"{e.get('mouvement', '?')} : {e.get('realise', '?')} (prescrit {e.get('prescrit', '?')})"
            {"au_dessus": up, "en_dessous": down}.get(e.get("sens"), other).append(txt)
        deviations.append({"w": n - 1, "up": up, "down": down, "other": other})

    # ── signaux ────────────────────────────────────────────────
    signals = []
    for key, label in ZONES:
        levels, notes = [], []
        for n in range(1, last + 1):
            s = ((journals.get(n) or {}).get("signaux") or {}).get(key) or {}
            levels.append(num(s.get("niveau")))
            notes.append(s.get("note") or "")
        signals.append({"id": key, "label": label, "levels": levels, "notes": notes})

    # ── KPI ────────────────────────────────────────────────────
    closed = [n for n, j in journals.items() if j.get("statut") == "close"]
    z2_mev = num(((vol_profile.get("z2") or {}).get("mev"))) or 60
    z2_ok = [n for n in closed if (num(((journals[n].get("realise") or {}).get("z2_min"))) or 0) >= z2_mev]
    first_open = d(instance["echeance_suivante"]["workouts"][0]["fait_box"])
    comps = [c for c in instance.get("competitions") or [] if c.get("statut") == "fait"]
    comp = comps[-1] if comps else None
    cur = next((w for w in weeks if w["current"]), None)
    cur_j = journals.get(cur["n"], {}) if cur else {}

    # ── prochains points ───────────────────────────────────────
    nexts = []
    for pm in (instance.get("points_de_mesure") or {}).values():
        if not isinstance(pm, dict) or "semaine" not in pm:
            continue
        nexts.append({"when": pm["date"], "week": pm["semaine"], "text": pm["contenu"], "sort": pm["date"][:10]})
    nexts.append({
        "when": first_open.strftime("%d/%m/%Y"), "week": "",
        "text": f"CrossFit Open {instance['echeance_suivante']['workouts'][0]['id']} — annonce le jeudi, fait en box le vendredi.",
        "sort": first_open.isoformat(),
    })
    cur_start = cur["start"] if cur else today.isoformat()
    nexts = sorted((x for x in nexts if x["sort"] >= cur_start), key=lambda x: x["sort"])

    constats = miniyaml.load(adir / "constats.yaml") or {}

    data = {
        "generated": today.isoformat(),
        "athlete": athlete,
        "last": last - 1,  # index (0-based) de la dernière semaine avec réalisé
        "phases": PHASES,
        "weeks": weeks,
        "kpis": {
            "weeks_done": len(closed), "weeks_total": len(weeks),
            "days_to_open": (first_open - today).days, "open_label": f"{instance['echeance_suivante']['workouts'][0]['id']} ({first_open.strftime('%d/%m/%Y')})",
            "competition": f"{comp.get('resultat', '')} — {comp.get('nom', '')}" if comp else "",
            "z2_ok": len(z2_ok), "z2_of": len(closed), "z2_mev": z2_mev,
        },
        "current": {
            "id": cur["id"] if cur else None, "meso": cur["meso"] if cur else None,
            "phase_micro": cur_j.get("phase_micro"), "synthese": (cur_j.get("synthese") or "").strip(),
            "suite": (cur_j.get("suite") or "").strip(),
        },
        "lifts": lifts,
        "volumes": volumes,
        "deviations": deviations,
        "signals": signals,
        "next": nexts,
        "constats": constats,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"analytics : {len(weeks)} semaines, {len(lifts)} mouvements, dernière semaine S{last:02d} → {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
